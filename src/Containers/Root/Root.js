import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Root.module.css";
import Header from "../../Components/Header";
import logo from "../../Assets/General/Images/logo.png";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
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
  addMultipleUsers,
  getAllExaminers,
  updateExaminer,
  verifyToken,
} from "../../Services/admin.service";
import cellEditFactory from "react-bootstrap-table2-editor";
function Root({ props }) {
  const { SearchBar } = Search;
  const history = useHistory();
  const [data, setData] = useState([]);
  const [permission, setPemission] = useState(["READ"]);
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

  const fileInput = React.useRef(null);
  const WritePermission = () => {
    setPemission(["WRITE"]);
    console.log(permission);
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
        console.log(json);
        json.map((item) => {
          console.log(item);
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
              // distance: item.Distance,
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
          // console.log(res);
          newData.push(res);
        });
        let Length = newData.length;
        console.log(Length);
        for (let i = Length - json.length; i < Length; i++) {
          newData[i].personalDetails.name = newData[i].personalDetails["name"]
            .replace("Mr.", "")
            .replace("Ms.", "")
            .replace("Dr.", "");

          console.log(newData[i]);
          for (let j = 0; j < Length; j++) {
            if (i != j) {
              console.log(i);

              if (
                newData[i].personalDetails.collegeemail ===
                newData[j]?.personalDetails.collegeemail
              ) {
                newData[j].roles = newData[j]?.roles.concat(newData[i].roles);
                const update = await updateExaminer({
                  user: newData[j],
                });
                newData[i] = null;
                console.log(i);
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
          console.log(res);
          toast.dismiss(loading);
          toast.success("Users Added Successfully");
        });
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
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
        console.log(res);
        toast.success("Data Loaded", {
          autoClose: 3000,
        });
      });
    }
    // get params from url
    // get params from url
  }, []);

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
            {/* <Link to={{ pathname: "/edit", state: "button" }}>{"button"}</Link> */}
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
                  history.push("/edit", {
                    row,

                    link: `${
                      new URLSearchParams(
                        window.location.href.split("?")[1]
                      ).get("search") == null
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
            )}
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
    onPageChange: (page, sizePerPage) => {
      console.log(page, sizePerPage);
    },
    showTotal: true,
    totalSize: data.length,
  };
  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    clickToEdit: true,
  };
  const afterSearch = () => {
    setSearch(document.getElementById("search-bar-0").value);
    history.push(
      `/dashboard?search=${document.getElementById("search-bar-0").value}`
    );
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
                  onSearch: (e) => {
                    console.log(e);
                  },
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
              {...toolkitprops.baseProps}
              {...paginationTableProps}
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

      <ToastContainer position="bottom-right" />
      <div className={styles.mainWrapper}>
        <div className={styles.Header}>
          <div>
            <img src={logo} />
          </div>
        </div>
        {/* <button
        className={styles.button + " " + styles.select}
        onClick={() => {
          // select all
          selection.forEach((item) => {
            item.checked = true;
            // console.log(item);
          });
        }}
      >
        Select All
      </button> */}
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
                // history.push("/import");
                // take input from user
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
                data.forEach((item) => {
                  //   dataField: "personalDetails.name",
                  //   text: "Name",
                  // },
                  // {
                  //   dataField: "personalDetails.phonenumber",
                  //   text: "Mobile",
                  // },
                  // {
                  //   dataField: "instituteDetails.institutename",
                  //   text: "Institute",
                  // },
                  // {
                  //   dataField: "personalDetails.personalEmail",
                  //   text: "Personal Email",
                  // },
                  // {
                  //   dataField: "personalDetails.collegeemail",
                  //   text: "Institute Mail",
                  // },
                  // {
                  //   dataField: "instituteDetails.role",
                  //   text: "Role of faculty",
                  // },
                  // {
                  //   dataField: "personalDetails.areaofinterest",
                  //   text: "areaofinterest",
                  //   hidden: true,
                  // },
                  // {
                  //   dataField: "roles",
                  //   text: "category",
                  //   hidden: true,
                  // },
                  // {
                  //   dataField: "documents.rcbook",
                  //   text: "rcbook",
                  //   hidden: true,
                  // },
                  // {
                  //   dataField: "documents.drivinglicense",
                  //   text: "drivinglicense",
                  //   hidden: true,
                  // },
                  // {
                  //   dataField: "documents.bankdetails.bankName",
                  //   text: "bankdetails",
                  //   hidden: true,
                  // },
                  // {
                  //   dataField: "documents.bankdetails.accountNumber",
                  //   text: "accountno",
                  //   hidden: true,
                  // },
                  // {
                  //   dataField: "documents.bankdetails.ifsccode",
                  //   text: "ifsccode",
                  //   hidden: true,
                  // },
                  // {
                  //   dataField: "documents.passbook",
                  //   text: "bankpassbook",
                  //   hidden: true,
                  // },
                  // {
                  //   dataField: "documents.cheque",
                  //   text: "cheque",
                  //   hidden: true,
                  // },
                  let obj = {
                    Name: item?.personalDetails?.name,
                    Mobile: item?.personalDetails?.phonenumber,
                    Institute: item?.instituteDetails?.institutename,
                    "Personal Email": item?.personalDetails?.personalEmail,
                    "Institute Mail": item?.personalDetails?.collegeemail,
                    "Role of faculty": item?.instituteDetails?.role,
                    "Area of Interest": item?.personalDetails?.areaofinterest,
                    "Role of Faculty": item?.roles,
                    "RC Book": item?.documents?.rcbook,
                    "Driving License": item?.documents?.drivinglicense,
                    "Bank Details": item?.documents?.bankdetails?.bankName,
                    "Account No": item?.documents?.bankdetails?.accountNumber,
                    "IFSC Code": item?.documents?.bankdetails?.ifsccode,
                    "Baank Passbook": item?.documents?.passbook,
                    Cheque: item?.documents?.cheque,
                  };
                  detailsData.push(obj);
                });
                console.log(detailsData);
                xlsx.utils.json_to_sheet(detailsData, "Export.xlsx");
                const ws = xlsx.utils.json_to_sheet(detailsData);
                const wb = xlsx.utils.book_new();
                xlsx.utils.book_append_sheet(wb, ws, "SheetJS");
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
        {/* add a search bar */}
        {/* <input
        className={styles.search}
        type="text"
        placeholder="Search"
        onChange={(e) => {
          // console.log(e.target.value);
        }}
      /> */}
        {/* <table>
        <thead>
          <tr>
            {fields.map((field, index) => (
              <th key={index}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  style={{
                    width: "100%",
                    cursor: "pointer",
                  }}
                  ref={(input) => {
                    if (input) {
                      selection[index] = input;
                    }
                  }}
                  id={row.id}
                  variant="filled"
                  type="checkbox"
                />
              </td>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.mobile}</td>
              <td>{row.institute}</td>
              <td>{row.personalEmail}</td>
              <td>{row.instituteMail}</td>
              <td>{row.role}</td>
              <td>
                <Link to="/edit">
                  <button className={styles.button + " " + styles.select}>
                    Edit
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}

        <PaginationProvider
          pagination={paginationFactory(options)}
          keyField="eid"
        >
          {contentTable}
        </PaginationProvider>
      </div>
    </div>
  );
}

export default Root;
