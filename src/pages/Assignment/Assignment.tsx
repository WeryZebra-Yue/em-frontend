import * as xlsx from "xlsx";
import { Cookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useEffect, useState, useMemo, useRef } from "react";
import Header from "../../components/Header/FHeader";
import { AssignmentTable, _input } from "../../utils/general.schema";
import {
  // deleteExaminer,
  getAllExaminers,
  getAssignments,
  getMetaData,
  getUniversities,
} from "../../services/admin.service";

import styles from "./Assignment.module.css";
// import Button from "../../components/Button";
import MaterialReactTable from "material-react-table";

import { SET_LOADING } from "../../redux/Auth/AuthActions";
import {
  cleanifyAssignment,
  // cleanifyA/szssignment,
  dismissToastie,
  excel,
  // excel,
  toastify,
} from "../../utils/general.helper";
// import { MenuItem } from "@mui/material";
// import { useNavigate } from "react-router-dom";
import Form from "../../components/Form";
import Excel from "../../components/Excel";
// import { MenuItem } from "@mui/material";
import Button from "../../components/Button";

function Assignment() {
  const fileInput = useRef<any>(null);
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const [file, setFile] = useState<any>(null);
  const [formPop, setFormPop] = useState({
    open: false,
    examiner: {},
  });
  const [excelPop, setExcelPop] = useState({
    open: false,
    examiner: [],
  });
  const [examiners, setExaminers] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [, setUniversities] = useState<any[]>([]);
  const [rowSelection, setRowSelection] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMetaData() {
      const data = await getMetaData();
      const _metaData = JSON.parse(localStorage.getItem("metaData") || "{}");
      localStorage.setItem("metaData", JSON.stringify(data));
      return data?.lastUpdated !== _metaData?.lastUpdated;
    }

    async function fetchData() {
      dispatch({
        type: SET_LOADING,
        payload: true,
      });
      const cookie = new Cookies();
      const _universities = await getUniversities();
      const _examiner = await getAllExaminers(cookie.get("token-ex"));
      localStorage.setItem("examiners", JSON.stringify(_examiner));
      localStorage.setItem("universities", JSON.stringify(_universities));

      setExaminers(JSON.parse(localStorage.getItem("examiners") || "{}"));
      setUniversities(JSON.parse(localStorage.getItem("universities") || "{}"));

      dispatch({
        type: SET_LOADING,
        payload: false,
      });
    }
    toastify("Fetching latest data.", "info", {
      autoClose: false,
      loading: true,
    });
    fetchMetaData().then(async (data) => {
      if (data) fetchData();
      else {
        if (!localStorage.getItem("examiners")) {
          const cookie = new Cookies();
          const _examiner = await getAllExaminers(cookie.get("token-ex"));
          localStorage.setItem("examiners", JSON.stringify(_examiner));
        }
        setExaminers(JSON.parse(localStorage.getItem("examiners") || "{}"));
        if (!localStorage.getItem("universities")) {
          const _universities = await getUniversities();
          localStorage.setItem("universities", JSON.stringify(_universities));
        }
        setUniversities(
          JSON.parse(localStorage.getItem("universities") || "{}")
        );
      }
      const assignments = await getAssignments();
      setAssignments(assignments);
      console.log(assignments);
      dismissToastie();
      toastify("Data fetched successfully.", "success", {
        autoClose: 1000,
      });
    });
  }, []);
  return (
    <div>
      <Header />
      {/* {examiners && examiners.length > 0 && ( */}
      <MaterialReactTable
        data={assignments}
        columns={useMemo(
          () =>
            Object.entries(AssignmentTable.Header).map(([accessor, value]) => ({
              ...value,
              accessorKey: accessor,
            })) as any,
          []
        )}
        state={{ rowSelection }}
        selectedRows={rowSelection}
        onRowSelectionChange={setRowSelection}
        // renderRowActionMenuItems={(row: any) => [
        //   <MenuItem
        //     key="edit"
        //     onClick={() => {
        //       navigate(`/edit/${row.row.original.eid}`, {
        //         state: {
        //           examiner: row.row.original,
        //         },
        //       });
        //     }}
        //   >
        //     <div className={styles.menuItem}>Edit </div>
        //   </MenuItem>,
        //   <MenuItem
        //     key="view"
        //     onClick={() => {
        //       setFormPop({
        //         open: true,
        //         examiner: row.row.original,
        //       });
        //     }}
        //   >
        //     <div className={styles.menuItem}>Assign</div>
        //   </MenuItem>,

        //   <MenuItem
        //     key="delete"
        //     onClick={async () => {
        //       toastify("Examiner is being removed.", "info", {
        //         autoClose: false,
        //         loading: true,
        //       });
        //       await deleteExaminer(row.row.original._id);
        //       const _temp = examiners.filter(
        //         (examiner) => examiner._id !== row.row.original._id
        //       );
        //       setExaminers(_temp);
        //       localStorage.setItem("examiners", JSON.stringify(_temp));
        //       dismissToastie();
        //       toastify("Examiner removed successfully.", "success", {
        //         autoClose: 1000,
        //       });
        //     }}
        //   >
        //     {" "}
        //     <div className={styles.menuItem}>Remove </div>
        //   </MenuItem>,
        // ]}
        renderTopToolbarCustomActions={() => (
          <div className={styles.topToolbar}>
            {/* <Button
              variant="outlined"
              onClick={() => {
                navigate("/add");
              }}
            >
              Add Examiner
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                if (fileInput.current) fileInput.current?.click();
              }}
            >
              Import from Excel
            </Button> */}
            <Button
              variant="outlined"
              onClick={() => {
                const cleaned = cleanifyAssignment(
                  Object.keys(rowSelection).length > 0
                    ? Object.keys(rowSelection).map(
                        (key) => assignments[parseInt(key)]
                      )
                    : assignments
                );
                excel(cleaned, "assignments");
              }}
            >
              Export to Excel
            </Button>
          </div>
        )}
        {...AssignmentTable.Props}
      />
      <input
        type="file"
        onChange={(e) => {
          e.preventDefault();
          if (e.target.files) {
            const reader = new FileReader();

            reader.onload = async (e) => {
              console.log(e);
              const res = e.target?.result;
              const workbook = xlsx.read(res, { type: "array" });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const json = xlsx.utils.sheet_to_json(worksheet);
              let newData: any = [];
              json.map(async (item: any) => {
                const res: any = {
                  e_id: item.Code,
                  personalDetails: {
                    name: item.Name,
                    phonenumber: item.Mobile,
                    collegeemail: item["Institute Mail"],
                    personalEmail: item["Personal Email"],
                  },
                  instituteDetails: {
                    institutename: item.Institute,
                    role: item["Role of faculty"],
                  },
                  bankDetails: {
                    ifscCode: item.IFSC,
                    bankName: item["Bank Name"],
                    accountNumber: item["Account No."],
                    branch: item.Branch,
                  },
                  remarks: [],
                };

                examiners.map(async (examiner: any) => {
                  try {
                    if (!res?.personalDetails?.name) {
                      res["remarks"] = [...res["remarks"], "Name missing"];
                    }
                    if (!res?.personalDetails?.collegeemail) {
                      res["remarks"] = [
                        ...res["remarks"],
                        "College email missing",
                      ];
                    }
                    if (!res?.personalDetails?.phonenumber) {
                      res["remarks"] = [
                        ...res["remarks"],
                        "Phone number missing",
                      ];
                    }
                    if (!res?.personalDetails?.personalEmail) {
                      res["remarks"] = [
                        ...res["remarks"],
                        "Personal email missing",
                      ];
                    }

                    if (
                      examiner?.personalDetails?.name
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s/g, "") ===
                      res?.personalDetails?.name
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s/g, "")
                    ) {
                      res["remarks"] = [...res["remarks"], "Name exists"];
                    }
                    if (
                      examiner?.personalDetails?.collegeemail
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s/g, "") ===
                      res?.personalDetails?.collegeemail
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s/g, "")
                    ) {
                      res["remarks"] = [
                        ...res["remarks"],
                        "College email exists",
                      ];
                    }
                    if (
                      examiner?.personalDetails?.phonenumber
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s/g, "") ===
                      res?.personalDetails?.phonenumber
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s/g, "")
                    ) {
                      res["remarks"] = [
                        ...res["remarks"],
                        "Phone number exists",
                      ];
                    }
                    if (
                      examiner?.personalDetails?.personalEmail
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s/g, "") ===
                      res?.personalDetails?.personalEmail
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s/g, "")
                    ) {
                      res["remarks"] = [
                        ...res["remarks"],
                        "Personal email exists",
                      ];
                    }
                  } catch (err) {}
                });
                newData.map(async (examiner: any) => {
                  try {
                    if (!res?.personalDetails?.name) {
                      res["remarks"] = [...res["remarks"], "Name missing"];
                    }
                    if (!res?.personalDetails?.collegeemail) {
                      res["remarks"] = [
                        ...res["remarks"],
                        "College email missing",
                      ];
                    }
                    if (!res?.personalDetails?.phonenumber) {
                      res["remarks"] = [
                        ...res["remarks"],
                        "Phone number missing",
                      ];
                    }
                    if (!res?.personalDetails?.personalEmail) {
                      res["remarks"] = [
                        ...res["remarks"],
                        "Personal email missing",
                      ];
                    }

                    if (
                      examiner?.personalDetails?.name
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s/g, "") ===
                      res?.personalDetails?.name
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s/g, "")
                    ) {
                      res["remarks"] = [...res["remarks"], "Name exists"];
                    }
                    if (
                      examiner?.personalDetails?.collegeemail
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s/g, "") ===
                      res?.personalDetails?.collegeemail
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s/g, "")
                    ) {
                      res["remarks"] = [
                        ...res["remarks"],
                        "College email exists",
                      ];
                    }
                    if (
                      examiner?.personalDetails?.phonenumber
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s/g, "") ===
                      res?.personalDetails?.phonenumber
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s/g, "")
                    ) {
                      res["remarks"] = [
                        ...res["remarks"],
                        "Phone number exists",
                      ];
                    }
                    if (
                      examiner?.personalDetails?.personalEmail
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s/g, "") ===
                      res?.personalDetails?.personalEmail
                        ?.toString()
                        .toLowerCase()
                        .replace(/\s/g, "")
                    ) {
                      res["remarks"] = [
                        ...res["remarks"],
                        "Personal email exists",
                      ];
                    }
                    newData.push(res);
                  } catch (err) {}
                });
                newData.push(res);
              });
              console.log(newData);
              setExcelPop({
                open: true,
                examiner: newData,
              });
            };
            reader.readAsArrayBuffer(e.target.files[0]);
          }
          // remove file from input
          if (fileInput.current) fileInput.current.value = "";
        }}
        accept=".xlsx"
        ref={fileInput}
        hidden
      />
      <Form
        open={formPop.open}
        onClose={() => {
          setFormPop({
            open: false,
            examiner: {},
          });
        }}
        examiner={formPop.examiner}
        universities={JSON.parse(localStorage.getItem("universities") || "{}")}
      />
      <Excel
        open={excelPop.open}
        onClose={() => {
          setExcelPop({
            ...excelPop,
            examiner: [],
            open: false,
          });
        }}
        examiner={excelPop.examiner}
        universities={JSON.parse(localStorage.getItem("universities") || "{}")}
      />
    </div>
  );
}

export default Assignment;
