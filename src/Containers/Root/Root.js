import React, { useEffect } from "react";
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
// import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Search } from "react-bootstrap-table2-toolkit";
import { Cookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import { getAllExaminers } from "../../Services/admin.service";
import cellEditFactory from "react-bootstrap-table2-editor";
function Root({ props }) {
  const { SearchBar } = Search;
  const history = useHistory();
  const [data, setData] = React.useState([]);
  useEffect(() => {
    const cookie = new Cookies();
    const token = cookie.get("token-ex");
    if (!token) {
      history.push("/");
    } else {
      toast.loading("Loading Data");
      const response = getAllExaminers(token);
      response.then((res) => {
        toast.dismiss();
        setData(res);
        // console.log(res);
        toast.success("Data Loaded", {
          autoClose: 3000,
        });
      });
    }
  }, []);

  const columns = [
    {
      dataField: "eid",
      text: "ID",
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
                history.push("/open", row);
              }}
              className={styles.add + " " + styles.button}
            >
              Open
            </button>
            <button
              onClick={() => {
                history.push("/edit", row);
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

  const options = {
    custom: true,
    paginationSize: 4,
    pageStartIndex: 1,
    firstPageText: "First",
    prePageText: "Back",
    nextPageText: "Next",
    lastPageText: "Last",
    nextPageTitle: "First page",
    prePageTitle: "Pre page",
    firstPageTitle: "Next page",
    lastPageTitle: "Last page",
    showTotal: true,
    totalSize: data.length,
  };
  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    clickToEdit: true,
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
      <ToolkitProvider keyField="id" columns={columns} data={data} search>
        {(toolkitprops) => (
          <div
            style={{
              width: "90%",
            }}
          >
            <SearchBar {...toolkitprops.searchProps} />
            <BootstrapTable
              keyField="id"
              bootstrap4
              striped
              hover
              bordered={true}
              cellEdit={cellEditFactory({ mode: "dbclick" })}
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
            justifyContent: "flex-start",
          }}
        >
          <button
            className={styles.button + " " + styles.add}
            variant="contained"
            color="primary"
            style={{
              margin: "0px",
              marginTop: "20px",
            }}
            onClick={() => {
              history.push("/add");
            }}
          >
            + New Examiner
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

        <PaginationProvider pagination={paginationFactory(options)}>
          {contentTable}
        </PaginationProvider>
      </div>
    </div>
  );
}

export default Root;
