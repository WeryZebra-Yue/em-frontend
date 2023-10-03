import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Root.module.css";
import Header from "../../Components/Header";
import logo from "../../Assets/General/Images/logo.png";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "../../global.css";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import * as xlsx from "xlsx";
import ToolkitProvider, {
  ToolkitContext,
} from "react-bootstrap-table2-toolkit";
import { Search } from "react-bootstrap-table2-toolkit";
import { Cookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  TextField,
} from "@mui/material";
import {
  addMultipleUsers,
  getAllExaminers,
  getUniversities,
  updateExaminer,
  verifyToken,
} from "../../Services/admin.service";
import cellEditFactory from "react-bootstrap-table2-editor";
function Root({ props }) {
  const { SearchBar } = Search;
  const history = useHistory();
  const fileInput = React.useRef(null);
  const [data, setData] = useState([]);
  const [permission, setPemission] = useState(["READ"]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [params, setParams] = useState([{}]);
  const [missingParams, setMissingParams] = useState([]);
  let [isOpen, setIsOpen] = useState(false);

  const [search, setSearch] = useState(
    `${
      new URLSearchParams(window.location.href.split("?")[1]).get("search") ==
      null
        ? ""
        : new URLSearchParams(window.location.href.split("?")[1]).get("search")
    }`
  );
  const [defaultSearch, setDefaultSearch] = useState(
    `${
      new URLSearchParams(window.location.href.split("?")[1]).get("search") ==
      null
        ? ""
        : new URLSearchParams(window.location.href.split("?")[1]).get("search")
    }`
  );
  useEffect(async () => {
    const cookie = new Cookies();

    const token = cookie.get("token-ex");
    if (!token) {
      history.push("/");
    } else {
      toast.loading("Loading Data");

      const response = await verifyToken(token);
      if (response.role === "WRITE") {
        setPemission(["WRITE"]);
      }
      const res = await getAllExaminers(token).then((res) => {
        toast.dismiss();
        setData(res);
        toast.success("Data Loaded", {
          autoClose: 3000,
        });
      });
      const institute = await getUniversities();
      console.log(institute);
      setInstitutes(institute);
    }
  }, []);
  //   school:
  //   data[0].e_id === "SOE"
  //     ? "School of Engineering"
  //     : "SON"
  //     ? "School of Nursing"
  //     : "SOP"
  //     ? "School of Physiotherapy"
  //     : "SLM"
  //     ? "School of Management"
  //     : "",
  // institute: data[0]?.instituteDetails?.institutename
  //   ? data[0]?.instituteDetails?.institutename
  //   : "",
  // course: "",
  // examiner: data[0]?.personalDetails?.name
  //   ? data[0]?.personalDetails?.name
  //   : "",
  // contact: data[0]?.personalDetails?.phonenumber
  //   ? data[0]?.personalDetails?.phonenumber
  //   : "",
  // email: data[0]?.personalDetails?.collegeemail
  //   ? data[0]?.personalDetails?.collegeemail
  //   : "",
  // degree: "",
  // semester: "",
  // code: "",
  // date: new Date().toLocaleDateString(),
  // travelled: data[0]?.instituteDetails?.institutename
  //   ? data[0]?.instituteDetails?.institutename
  //   : "",
  // city: "",
  // bank: data[0]?.documents?.bankDetails?.bankName
  //   ? data[0]?.documents?.bankDetails?.bankName
  //   : "",
  // branch: "",
  // account: data[0]?.documents?.bankDetails?.accountNumber
  //   ? data[0]?.documents?.bankDetails?.accountNumber
  //   : "",
  // ifsc: data[0]?.documents?.bankDetails?.ifscCode
  //   ? data[0]?.documents?.bankDetails?.ifscCode
  //   : "",
  // kilometres: distance,
  // ta: `${100 * distance}`,
  // da: 200,
  // total: `${100 * distance + 200}`,
  const names = [
    {
      key: "school",
      name: "School",
    },
    {
      key: "institute",
      name: "Institute",
    },
    {
      key: "course",
      name: "Course",
    },
    {
      key: "examiner",
      name: "Examiner",
    },
    {
      key: "contact",
      name: "Contact",
    },
    {
      key: "email",
      name: "Email",
    },
    {
      key: "degree",
      name: "Degree",
    },
    {
      key: "semester",
      name: "Semester",
    },
    {
      key: "code",
      name: "Subject Code",
    },
    {
      key: "date",
      name: "Date",
    },
    {
      key: "travelled",
      name: "Travelled",
    },
    {
      key: "city",
      name: "City",
    },
    {
      key: "mode",
      name: "Mode of Travel",
    },
    {
      key: "bank",
      name: "Bank",
    },
    {
      key: "branch",
      name: "Branch",
    },
    {
      key: "account",
      name: "Account",
    },
    {
      key: "ifsc",
      name: "IFSC",
    },
    {
      key: "kilometres",
      name: "Kilometres",
    },
    {
      key: "ta",
      name: "TA",
    },
    {
      key: "da",
      name: "DA",
    },
    {
      key: "total",
      name: "Total",
    },
  ];
  const columns = [
    {
      dataField: "eid",
      text: "ID",
      sort: true,
    },
    {
      dataField: "personalDetails.name",
      text: "Name",
    },
    {
      dataField: "personalDetails.phonenumber",
      text: "Mobile",
    },

    {
      dataField: "instituteDetails.institutename",
      text: "Institute",
    },
    {
      dataField: "personalDetails.personalEmail",
      text: "Personal Email",
    },
    {
      dataField: "personalDetails.collegeemail",
      text: "Institute Mail",
    },

    {
      dataField: "instituteDetails.role",
      text: "Role of faculty",
    },
    {
      dataField: "action",
      text: "Action",
      formatter: (cell, row) => {
        const toPathwithProps = {
          pathname: "/edit",
          state: "hello",
        };
        return (
          <div>
            <button
              onClick={() => {
                history.push("/open", {
                  row,
                  link: `${
                    new URLSearchParams(window.location.href.split("?")[1]).get(
                      "search"
                    ) == null
                      ? ""
                      : new URLSearchParams(
                          window.location.href.split("?")[1]
                        ).get("search")
                  }`,
                });
              }}
              className={styles.add + " " + styles.button}
            >
              Open
            </button>
            {permission[0] === "WRITE" && (
              <button
                onClick={() => {
                  // toast.loading("Loading Data");
                  getParams([row]);
                  // window.open(
                  //   "ta-da.html",
                  //   "_blank" // <- This is what makes it open in a new window.
                  // );
                }}
                className={styles.add + " " + styles.button}
              >
                Form
              </button>
            )}
            <button
              onClick={() => {
                history.push("/edit", {
                  row,

                  link: `${
                    new URLSearchParams(window.location.href.split("?")[1]).get(
                      "search"
                    ) == null
                      ? ""
                      : new URLSearchParams(
                          window.location.href.split("?")[1]
                        ).get("search")
                  }`,
                });
              }}
              className={styles.add + " " + styles.button}
            >
              Edit
            </button>
          </div>
        );
      },
    },
    {
      dataField: "_id",
      text: "id",
      hidden: true,
    },
    {
      dataField: "personalDetails.areaofinterest",
      text: "areaofinterest",
      hidden: true,
    },
    {
      dataField: "roles",
      text: "category",
      hidden: true,
    },

    {
      dataField: "documents.rcbook",
      text: "rcbook",
      hidden: true,
    },
    {
      dataField: "documents.drivinglicense",
      text: "drivinglicense",
      hidden: true,
    },
    {
      dataField: "documents.bankdetails.bankName",
      text: "bankdetails",
      hidden: true,
    },
    {
      dataField: "documents.bankdetails.accountNumber",
      text: "accountno",
      hidden: true,
    },
    {
      dataField: "documents.bankdetails.ifsccode",
      text: "ifsccode",
      hidden: true,
    },
    {
      dataField: "documents.passbook",
      text: "bankpassbook",
      hidden: true,
    },
    {
      dataField: "documents.cheque",
      text: "cheque",
      hidden: true,
    },
  ];

  const getDistance = (institute) => {
    let distance = 0;
    console.log(institutes);
    institutes.forEach((item) => {
      if (item.name === institute) {
        distance = item.distance;
        return distance;
      }
    });
    return distance;
  };
  const getParams = async (data) => {
    const insitutes = await getUniversities();
    let distance = 0;
    insitutes.forEach((item) => {
      if (item.name === data[0]?.instituteDetails?.institutename) {
        distance = item.distance;
        return distance;
      }
    });

    const params = {
      school:
        data[0].e_id === "SOE"
          ? "School of Engineering"
          : "SON"
          ? "School of Nursing"
          : "SOP"
          ? "School of Physiotherapy"
          : "SLM"
          ? "School of Management"
          : "",
      institute: data[0]?.instituteDetails?.institutename
        ? data[0]?.instituteDetails?.institutename
        : "",
      course: "",
      examiner: data[0]?.personalDetails?.name
        ? data[0]?.personalDetails?.name
        : "",
      contact: data[0]?.personalDetails?.phonenumber
        ? data[0]?.personalDetails?.phonenumber
        : "",
      email: data[0]?.personalDetails?.collegeemail
        ? data[0]?.personalDetails?.collegeemail
        : "",
      degree: "",
      semester: "",
      code: "",
      mode: "",
      date: new Date().toLocaleDateString(),
      travelled: data[0]?.instituteDetails?.institutename
        ? data[0]?.instituteDetails?.institutename
        : "",
      city: "",
      bank: data[0]?.documents?.bankdetails?.bankName
        ? data[0]?.documents?.bankdetails?.bankName
        : "",
      branch: "",
      account: data[0]?.documents?.bankdetails?.accountNumber
        ? data[0]?.documents?.bankdetails?.accountNumber
        : "",
      ifsc: data[0]?.documents?.bankdetails?.ifscCode
        ? data[0]?.documents?.bankdetails?.ifscCode
        : "",
      kilometres: distance,
      ta: `${100 * distance}`,
      da: 200,
      total: `${100 * distance + 200}`,
    };
    const missingParams = [];
    for (let key in params) {
      if (params[key] === "") {
        console.log(key);
        missingParams.push({
          name: names.filter((item) => item.key === key)[0].name,
          value: key,
          val: params[key],
        });
      }
    }
    console.log(missingParams);
    if (missingParams.length > 0) {
      setMissingParams(missingParams);
      setParams(params);
      setIsOpen(true);
      return;
    }
    const reve = "/ta-da.html?" + new URLSearchParams(params).toString();
    console.log(reve);
    toast.dismiss();
    window.open(
      reve,
      "_blank" // <- This is what makes it open in a new window.
    );
  };
  const readUploadFile = (e) => {
    const loading = toast.loading("Upload in progress");
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const res = e.target.result;
        const workbook = xlsx.read(res, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        let newData = [...data];
        json.map((item) => {
          const res = {
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
            roles: [item["Category"]],
            documents: {
              bankDetails: {
                ifscCode: item.IFSC,
                bankName: item["Bank Name"],
                accountNumber: item["Account No."],
              },
            },
          };
          newData.push(res);
        });
        let Length = newData.length;
        for (let i = Length - json.length; i < Length; i++) {
          newData[i].personalDetails.name = newData[i].personalDetails["name"]
            .replace("Mr.", "")
            .replace("Ms.", "")
            .replace("Dr.", "");

          for (let j = 0; j < Length; j++) {
            if (i != j) {
              if (
                newData[i].personalDetails.collegeemail ===
                newData[j]?.personalDetails.collegeemail
              ) {
                newData[j].roles = newData[j]?.roles.concat(newData[i].roles);
                const update = await updateExaminer({
                  user: newData[j],
                });
                newData[i] = null;
                break;
                // Length--;
              }
            }
          }
        }
        let finalData = [];
        for (let i = Length - json.length; i < Length; i++) {
          if (newData[i] !== null) {
            finalData.push(newData[i]);
          }
        }
        addMultipleUsers(finalData).then((res) => {
          toast.dismiss(loading);
          toast.success("Users Added Successfully");
        });
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  const options = {
    custom: true,
    paginationSize: 4,
    pageStartIndex: 1,
    firstPageText: "First",
    prePageText: "Back",
    nextPageText: "Next",
    lastPage: false,
    nextPageTitle: "First page",
    prePageTitle: "Pre page",
    firstPageTitle: "Next page",
    lastPageTitle: "Last page",
    onPageChange: (page, sizePerPage) => {},
    showTotal: true,
    totalSize: data.length,
  };
  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,
    style: { backgroundColor: "#c8e6c9" },
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        setSelectedRows([...selectedRows, row]);
      } else {
        setSelectedRows(selectedRows.filter((item) => item.eid !== row.eid));
      }
    },
  };
  const afterSearch = () => {
    setSearch(document.getElementById("search-bar-0").value);
    history.push(
      `/dashboard?search=${document.getElementById("search-bar-0").value}`
    );
  };
  const WritePermission = () => {
    setPemission(["WRITE"]);
  };
  const contentTable = ({ paginationProps, paginationTableProps }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ToolkitProvider
        keyField="eid"
        columns={columns}
        data={data}
        search={{ afterSearch, defaultSearch: defaultSearch }}
      >
        {(toolkitprops) => (
          <div
            style={{
              width: "90%",
            }}
          >
            {
              <SearchBar
                searchProps={{
                  onSearch: (e) => {},
                }}
                {...toolkitprops.searchProps}
                keyField="eid"
              />
            }

            <BootstrapTable
              bootstrap4
              striped
              hover
              bordered={true}
              keyField="eid"
              {...paginationTableProps}
              {...toolkitprops.baseProps}
              selectRow={selectRow}
            />
          </div>
        )}
      </ToolkitProvider>

      <PaginationListStandalone {...paginationProps} />
    </div>
  );
  return (
    <div>
      <Header />
      <ToastContainer
        position="bottom-right"
        style={{
          fontFamily: "Poppins",
        }}
      />
      <div className={styles.mainWrapper}>
        <div className={styles.Header}>
          <div>
            <img src={logo} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: "90%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <button
              className={styles.button + " " + styles.add}
              variant="contained"
              color="primary"
              style={{
                margin: "0px",
                marginTop: "20px",
              }}
              onClick={() => {
                history.push("/add", {
                  link: `${
                    new URLSearchParams(window.location.href.split("?")[1]).get(
                      "search"
                    ) == null
                      ? ""
                      : new URLSearchParams(
                          window.location.href.split("?")[1]
                        ).get("search")
                  }`,
                });
              }}
            >
              + New Examiner
            </button>
            <input
              type="file"
              onChange={readUploadFile}
              accept=".xlsx"
              ref={fileInput}
              hidden
            />
            <button
              className={styles.button + " " + styles.add}
              variant="contained"
              color="primary"
              style={{
                margin: "0px",
                marginTop: "20px",
              }}
              onClick={() => {
                fileInput.current.click();
              }}
            >
              Import (Excel)
            </button>
            <button
              className={styles.button + " " + styles.export}
              variant="contained"
              color="primary"
              style={{
                margin: "0px",
                marginTop: "20px",
              }}
              onClick={() => {
                let detailsData = [];
                let datas = [];
                if (selectedRows.length > 0) datas = selectedRows;
                else datas = data;
                datas.forEach((item, index) => {
                  let distnace = getDistance(
                    item?.instituteDetails?.institutename
                  );
                  let obj = {
                    "Sr. No.": index + 1,
                    Class: " ",
                    "Institute Code": item?.e_id,
                    "External Faculty Name": item?.personalDetails?.name,
                    "External Faculty's Contact No.":
                      item?.personalDetails?.phonenumber,
                    "College Email ID": item?.personalDetails?.collegeemail,
                    "Personal Email ID": item?.personalDetails?.personalEmail,
                    "Bank Name": item?.documents?.bankDetails?.bankName,
                    "Bank Account No.":
                      item?.documents?.bankDetails?.accountNumber,
                    "IFSC Code": item?.documents?.bankDetails?.ifscCode,
                    "Role of Faculty": item?.instituteDetails?.role,
                    Institute: item?.instituteDetails?.institutename,
                    Distance: distnace,
                    TA: distnace * 30,
                    DA: 200,
                    TOTAL: distnace * 30 + 200,
                    "External Faculty's Sign.": " ",
                  };
                  detailsData.push(obj);
                });
                xlsx.utils.json_to_sheet(detailsData, "Export.xlsx");
                const ws = xlsx.utils.json_to_sheet(detailsData);
                const wb = xlsx.utils.book_new();
                xlsx.utils.book_append_sheet(wb, ws, "SheetJS");
                // style rows
                wb.Sheets["SheetJS"]["!cols"] = [{ wch: 15 }];
                wb.Sheets["SheetJS"]["!rows"] = [{ hpt: 30 }];
                // style cells
                wb.Sheets["SheetJS"]["A1"].s = {
                  font: {
                    sz: 14,
                    bold: true,
                  },
                  alignment: {
                    horizontal: "center",
                    vertical: "center",
                  },
                };
                wb.Sheets["SheetJS"]["A1"].s.fill = {
                  fgColor: { rgb: "FFFFAA00" },
                };
                wb.Sheets["SheetJS"]["A1"].s.border = {
                  top: { style: "thin", color: { rgb: "FF000000" } },
                  bottom: { style: "thin", color: { rgb: "FF000000" } },
                  left: { style: "thin", color: { rgb: "FF000000" } },
                  right: { style: "thin", color: { rgb: "FF000000" } },
                };
                wb.Sheets["SheetJS"]["A1"].s.alignment = {
                  horizontal: "center",
                  vertical: "center",
                  wrapText: true,
                };
                xlsx.writeFile(wb, "Export.xlsx");
              }}
            >
              Export (Excel)
            </button>
          </div>
          <button
            className={styles.button + " " + styles.delete}
            variant="contained"
            color="primary"
            style={{
              margin: "0px",
              marginTop: "20px",
            }}
            onClick={() => {
              const cookie = new Cookies();
              cookie.remove("token-ex");
              history.push("/");
            }}
          >
            Sign Out
          </button>
        </div>
        <br />

        <PaginationProvider
          pagination={paginationFactory(options)}
          keyField="eid"
        >
          {contentTable}
        </PaginationProvider>
      </div>
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        size="lg"
      >
        <DialogTitle
          style={{
            fontFamily: "Poppins",
          }}
        >
          Fill the missing details
        </DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(params);
            const reve =
              "/ta-da.html?" + new URLSearchParams(params).toString();
            console.log(reve);
            toast.dismiss();
            window.open(
              reve,
              "_blank" // <- This is what makes it open in a new window.
            );
            setIsOpen(false);
          }}
        >
          <DialogContent
            style={{
              fontFamily: "Poppins",
            }}
          >
            <div>
              {missingParams.map((item, index) => (
                <div
                  style={{
                    marginBottom: "20px",
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "400px",
                    width: "70vw",
                  }}
                >
                  <div
                    style={{
                      padding: "10px",
                      paddingLeft: "0px",
                    }}
                  >
                    <b>{item.name}</b>
                  </div>

                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    style={{
                      fontFamily: "Poppins",
                    }}
                    inputProps={{
                      id: item.value,
                      onChange: (e) => {
                        setParams({
                          ...params,
                          [item.value]: e.target.value,
                        });
                      },
                    }}
                    required
                  />
                </div>
              ))}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
              style={{
                textTransform: "capitalize",
                fontFamily: "Poppins",
                cursor: "pointer",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outlined"
              style={{
                textTransform: "capitalize",
                fontFamily: "Poppins",
                cursor: "pointer",
              }}
              // onClick={(e) => {
              //   e.preventDefault();
              //   console.log(e.target);
              //   // const reve =
              //   //   "/ta-da.html?" + new URLSearchParams(params).toString();
              //   // console.log(reve);
              //   // toast.dismiss();
              //   // window.open(
              //   //   reve,
              //   //   "_blank" // <- This is what makes it open in a new window.
              //   // );
              //   // setIsOpen(false);
              // }}
            >
              Download
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default Root;
