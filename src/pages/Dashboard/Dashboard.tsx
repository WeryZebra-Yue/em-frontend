import * as xlsx from "xlsx";
import { Cookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useEffect, useState, useMemo, useRef } from "react";
import Header from "../../components/Header/FHeader";
import { MetricTable, _input } from "../../utils/general.schema";
import {
  deleteExaminer,
  getAllExaminers,
  getMetaData,
  getUniversities,
} from "../../services/admin.service";

import styles from "./Dashboard.module.css";
import Button from "../../components/Button";
import MaterialReactTable from "material-react-table";

import { SET_LOADING } from "../../redux/Auth/AuthActions";
import {
  cleanify,
  dismissToastie,
  excel,
  toastify,
} from "../../utils/general.helper";
import { MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Form from "../../components/Form";
import Excel from "../../components/Excel";

function Dashboard() {
  const fileInput = useRef<any>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      // if (!localStorage.getItem("examiners"))
      localStorage.setItem("examiners", JSON.stringify(_examiner));
      // if (!localStorage.getItem("universities"))
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
        data={examiners}
        columns={useMemo(
          () =>
            Object.entries(MetricTable.Header).map(([accessor, value]) => ({
              ...value,
              accessorKey: accessor,
            })) as any,
          []
        )}
        state={{ rowSelection }}
        selectedRows={rowSelection}
        onRowSelectionChange={setRowSelection}
        renderRowActionMenuItems={(row: any) => [
          <MenuItem
            key="edit"
            onClick={() => {
              navigate(`/edit/${row.row.original.eid}`, {
                state: {
                  examiner: row.row.original,
                },
              });
            }}
          >
            <div className={styles.menuItem}>Edit </div>
          </MenuItem>,
          <MenuItem
            key="view"
            onClick={() => {
              setFormPop({
                open: true,
                examiner: row.row.original,
              });
            }}
          >
            <div className={styles.menuItem}>Assign</div>
          </MenuItem>,

          <MenuItem
            key="delete"
            onClick={async () => {
              toastify("Examiner is being removed.", "info", {
                autoClose: false,
                loading: true,
              });
              try {
                await deleteExaminer(row.row.original._id);
                const _temp = examiners.filter(
                  (examiner) => examiner._id !== row.row.original._id
                );
                setExaminers(_temp);
                localStorage.setItem("examiners", JSON.stringify(_temp));
                dismissToastie();
                toastify("Examiner removed successfully.", "success", {
                  autoClose: 1000,
                });
              } catch (err) {
                toastify("Examiner could not be removed.", "error", {
                  autoClose: 1000,
                });
              }
            }}
          >
            {" "}
            <div className={styles.menuItem}>Remove </div>
          </MenuItem>,
        ]}
        renderTopToolbarCustomActions={() => (
          <div className={styles.topToolbar}>
            <Button
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
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                const cleaned = cleanify(
                  Object.keys(rowSelection).length > 0
                    ? Object.keys(rowSelection).map(
                        (key) => examiners[parseInt(key)]
                      )
                    : examiners
                );
                excel(cleaned, "examiners");
              }}
            >
              Export to Excel
            </Button>
          </div>
        )}
        {...MetricTable.Props}
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
                      if (!res["remarks"].includes("Name missing"))
                        res["remarks"] = [...res["remarks"], "Name missing"];
                    }
                    if (!res?.personalDetails?.collegeemail) {
                      if (!res["remarks"].includes("College email missing"))
                        res["remarks"] = [
                          ...res["remarks"],
                          "College email missing",
                        ];
                    }
                    if (!res?.personalDetails?.phonenumber) {
                      if (!res["remarks"].includes("Phone number missing"))
                        res["remarks"] = [
                          ...res["remarks"],
                          "Phone number missing",
                        ];
                    }
                    if (!res?.personalDetails?.personalEmail) {
                      if (!res["remarks"].includes("Personal email missing"))
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
                      // if (!res["remarks"].includes("Name exists"))
                      //   res["remarks"] = [...res["remarks"], "Name exists"];
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
                      if (!res["remarks"].includes("College email exists")) {
                        res["remarks"] = [
                          ...res["remarks"],
                          "College email exists",
                        ];
                      }
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
                      if (!res["remarks"].includes("Phone number exists"))
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
                      // if check if personal email exists in remarks
                      if (
                        !res["remarks"].includes("Personal email exists") &&
                        res?.personalDetails?.personalEmail !== "" &&
                        res?.personalDetails?.personalEmail !== undefined
                      ) {
                        res["remarks"] = [
                          ...res["remarks"],
                          "Personal email exists",
                        ];
                      }
                    }
                  } catch (err) {}
                });
                newData.map(async (examiner: any) => {
                  try {
                    if (!res?.personalDetails?.name) {
                      if (!res["remarks"].includes("Name missing"))
                        res["remarks"] = [...res["remarks"], "Name missing"];
                    }
                    if (!res?.personalDetails?.collegeemail) {
                      if (!res["remarks"].includes("College email missing"))
                        res["remarks"] = [
                          ...res["remarks"],
                          "College email missing",
                        ];
                    }
                    if (!res?.personalDetails?.phonenumber) {
                      if (!res["remarks"].includes("Phone number missing"))
                        res["remarks"] = [
                          ...res["remarks"],
                          "Phone number missing",
                        ];
                    }
                    if (!res?.personalDetails?.personalEmail) {
                      if (!res["remarks"].includes("Personal email missing"))
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
                      // res["remarks"] = [...res["remarks"], "Name exists"];
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
        examiners={examiners}
        setExaminers={setExaminers}
      />
    </div>
  );
}

export default Dashboard;
