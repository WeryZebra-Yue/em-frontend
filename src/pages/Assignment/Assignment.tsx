import * as xlsx from "xlsx";
import { Cookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useEffect, useState, useMemo, useRef } from "react";
import Header from "../../components/Header/FHeader";
import { AssignmentTable, _input } from "../../utils/general.schema";
import {
  deleteExaminer,
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
import { MenuItem } from "@mui/material";

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
      // loop through the assignments and add the examiner details
      // to the assignment
      const _examiners = JSON.parse(localStorage.getItem("examiners") || "{}");
      const _universities = JSON.parse(
        localStorage.getItem("universities") || "{}"
      );
      const _assignments = assignments.map((assignment: any) => {
        const examiner = _examiners.find(
          (examiner: any) => examiner.eid === assignment.eid
        );
        const university = _universities.find(
          (university: any) => university.uid === assignment.uid
        );
        return {
          ...assignment,
          examiner,
          university,
        };
      });
      setAssignments(_assignments);
      console.log(_assignments);
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
        renderRowActionMenuItems={(row: any) => [
          <MenuItem
            key="delete"
            onClick={() => {
              toastify("Deleting assignment", "info", {
                autoClose: false,
                loading: true,
              });
              deleteExaminer(row.row.original._id).then(() => {
                // const _examiners = JSON.parse(
                //   localStorage.getItem("examiners") || "{}"
                // );
                const _assignments = assignments.filter(
                  (assignment) => assignment._id !== row.row.original._id
                );
                setAssignments(_assignments);

                dismissToastie();
                toastify("Assignment deleted successfully.", "success", {
                  autoClose: 1000,
                });
              });
            }}
          >
            <div className={styles.menuItem}>Delete </div>
          </MenuItem>,
          <MenuItem
            key="download"
            onClick={() => {
              // https://ppsudb.vercel.app/ta-da.html?school=School+of+Engineering&institute=P+P+Savani+School+of+Engineering%2C+Kosamba&course=tEST&examiner=+Karm+Balar&contact=8866393303&email=karm.balar%40ssasit.ac.in&degree=12&semester=123&code=21&mode=Car&date=19%2F11%2F2023&travelled=P+P+Savani+School+of+Engineering%2C+Kosamba&city=232&bank=State+Bank+of+India&branch=123&account=test&ifsc=1&kilometres=0&ta=0&da=200&total=200&conveyer=VARUN+THUMMAR
              // {
              //   "_id": "65bf75ccb3cfdd31a4ba1aaa",
              //   "eid": "SOE0002",
              //   "formDetails": {
              //       "date": "2024-02-06",
              //       "conveyer": "Barkha Wadhwani",
              //       "course": "Computer Engineering",
              //       "code": "SECE2023",
              //       "semester": "7",
              //       "degree": "Degree"
              //   },
              //   "travelDetails": {
              //       "mode": "Car",
              //       "city": "Surat",
              //       "kilometres": 23,
              //       "da": 200,
              //       "ta": 460,
              //       "manual": 0,
              //       "institute": "Shroff S R  Rotary Insitute of Chemical Technology"
              //   },
              //   "payDetails": {
              //       "total": 202
              //   },
              //   "__v": 0,
              //   "examiner": {
              //       "_id": "636514d64a0675175ece9124",
              //       "personalDetails": {
              //           "name": " Mital Patel",
              //           "phonenumber": 9925938357,
              //           "collegeemail": "mital.patel@srict.in"
              //       },
              //       "instituteDetails": {
              //           "institutename": "Shroff S R  Rotary Insitute of Chemical Technology"
              //       },
              //       "roles": [
              //           "Paper Setter & Examiner",
              //           null,
              //           null,
              //           "Paper Setter & Examiner",
              //           "Examiner"
              //       ],
              //       "e_id": "SOE",
              //       "eid": "SOE0002",
              //       "bankDetails": {
              //           "bankName": "SBI",
              //           "accountNumber": "200DSNKDSKN",
              //           "branch": "Surat",
              //           "ifscCode": "20SE02C"
              //       }
              //   },
              //   "university": {
              //       "_id": "6367882e566db8c9d84784cb",
              //       "name": "Alpha College of Engineering & Technology, Gandhinagar ",
              //       "distance": 253
              //   }
              const _row = row.row.original;
              const _input = {
                school: _row?.university?.name,
                institute: _row?.university?.name,
                course: _row?.formDetails?.course,
                examiner: _row?.examiner?.personalDetails?.name,
                contact: _row?.examiner?.personalDetails?.phonenumber,
                email: _row?.examiner?.personalDetails?.collegeemail,
                degree: _row?.formDetails?.degree,
                semester: _row?.formDetails?.semester,
                code: _row?.formDetails?.code,
                mode: _row?.travelDetails?.mode,
                date: _row?.formDetails?.date,
                travelled: _row?.travelDetails?.institute,
                city: _row?.travelDetails?.city,
                bank: _row?.examiner?.bankDetails?.bankName,
                branch: _row?.examiner?.bankDetails?.branch,
                account: _row?.examiner?.bankDetails?.accountNumber,
                ifsc: _row?.examiner?.bankDetails?.ifscCode,
                kilometres: _row?.university?.distance,
                ta: _row?.travelDetails?.ta,
                da: _row?.travelDetails?.da,
                total: _row?.payDetails?.total,
                conveyer: _row?.travelDetails?.conveyer,
              };

              const url = new URL("/ta-da.html", "http://ppsudb.vercel.app");
              url.search = new URLSearchParams(_input).toString();
              window.open(url.toString(), "_blank");
            }}
          >
            <div className={styles.menuItem}>Download form</div>
          </MenuItem>,
        ]}
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
