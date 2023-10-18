import React from "react";
import Header from "../../Components/Header";
import styles from "./Edit.module.css";
import logo from "../../Assets/General/Images/logo.png";
import { uploadImage } from "../../Services/storage.service";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { Cookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import ImagePopup from "../../Components/Popup/Popup";
import { getUniversities, updateExaminer } from "../../Services/admin.service";

function Edit() {
  const history = useHistory();
  const [data, setData] = React.useState({});
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [popupImage, setPopupImage] = React.useState(false);
  const [Universities, setUniversities] = React.useState(null);
  const [areaOfInterest, setAreaOfInterest] = React.useState([]);
  useEffect(async () => {
    const cookie = new Cookies();
    const token = cookie.get("token-ex");
    if (!token) {
      window.location.href = "/";
    }
    if (history.location.state.row?._id) {
      // const temp = history.location.state.row;
      // const personalDetails = {
      //   name: temp?.name ? temp?.name : "",
      //   phonenumber: temp?.phonenumber ? temp?.phonenumber : "",
      //   personalEmail: temp?.personalEmail ? temp?.personalEmail : "",
      //   collegeemail: temp?.collegeemail ? temp?.collegeemail : "",
      //   areaofinterest: temp?.areaofinterest ? temp?.areaofinterest : "",
      // };
      // const instituteDetails = {
      //   institutename: temp?.institutename ? temp?.institutename : "",
      //   role: temp?.role ? temp?.role : "",
      // };
      // const documents = {
      //   rcbook: temp?.rcbook ? temp?.rcbook : "",
      //   drivinglicenes: temp?.drivinglicenes ? temp?.drivinglicenes : "",
      //   passbook: temp?.passbook ? temp?.passbook : "",
      //   cheque: temp?.cheque ? temp?.cheque : "",
      //   bankdetails: {
      //     bankName: temp?.bankdetails?.bankName
      //       ? temp?.bankdetails?.bankName
      //       : "",
      //     accountNumber: temp?.bankdetails?.accountNumber
      //       ? temp?.bankdetails?.accountNumber
      //       : "",
      //     ifscCode: temp?.bankdetails?.ifscCode
      //       ? temp?.bankdetails?.ifscCode
      //       : "",
      //   },
      // };

      // const roles = temp?.roles ? temp?.roles : [];
      //   e_id: temp.eid,
      //   personalDetails,
      //   instituteDetails,
      //   documents,
      //   roles,
      // });
      // setData({
      //   e_id: temp.eid,
      //   personalDetails,
      //   instituteDetails,
      //   documents,
      //   roles,
      // });
      setData(history.location.state.row);
      console.log(history.location.state.row);
      if (history.location.state.row?.personalDetails?.areaofinterest) {
        setAreaOfInterest(
          history.location.state.row?.personalDetails?.areaofinterest
        );
      }
    } else {
      history.push("/dashboard");
    }
    const res = await getUniversities();
    setUniversities(res);
  }, []);
  const uploadImageCN = async (file) => {
    const URL = await uploadImage(file).then((res) => {
      return res[0];
    });
    return URL;
  };

  return (
    <div
      style={{
        backgroundColor: "#5c2b2b",
      }}
    >
      <ToastContainer position="bottom-right" />
      <Header />
      <div className={styles.mainWrapper}>
        <div className={styles.Header}>
          <div>
            <img src={logo} />
          </div>
        </div>
        <div className={styles.loginText}>New Examiner</div>
        {data && (
          <div className={styles.formWrapper}>
            <div>
              <form
                className={styles.form}
                onSubmit={async (e) => {
                  e.preventDefault();
                  const personalDetails = {
                    name: e.target.elements[1].value,
                    phonenumber: e.target.elements[2].value,
                    personalEmail: e.target.elements[3].value,
                    collegeemail: e.target.elements[4].value,
                    areaofinterest: areaOfInterest,
                  };
                  const lengtt = areaOfInterest.length + 1;
                  const instituteDetails = {
                    institutename: e.target.elements[lengtt + 6].value,
                    role: e.target.elements[lengtt + 7].value,
                  };
                  let roles = [];
                  if (e.target.elements[lengtt + 8].checked) {
                    roles.push("Examiner");
                  }
                  if (e.target.elements[lengtt + 9].checked) {
                    roles.push("Paper Setter");
                  }
                  if (e.target.elements[lengtt + 10].checked) {
                    roles.push("Expert");
                  }

                  // let rcBook = e.target.elements[lengtt+ 11]?.files
                  //   ? e.target.elements[lengtt+ 11]?.files[0]
                  //   : false;
                  // let drivingLicenes = e.target.elements[lengtt+ 13]?.files
                  //   ? e.target.elements[lengtt+ 13]?.files[0]
                  //   : false;
                  // let bankPassbook = e.target.elements[lengtt+ 18]?.files
                  //   ? e.target.elements[lengtt+ 18]?.files[0]
                  //   : false;
                  // let cancelledCheque = e.target.elements[lengtt+ 20]?.files
                  //   ? e.target.elements[lengtt+ 20]?.files[0]
                  //   : false;
                  let rcBookURL = data?.documents?.rcbook;
                  let drivingLicenesURL = data?.documents?.drivinglicenes;
                  let bankPassbookURL = data?.documents?.passbook;
                  let cancelledChequeURL = data?.documents?.cheque;
                  let loading = toast.loading("Uploading Documents");
                  //   e.target.elements[lengtt+ 11].files,
                  //   e.target.elements[lengtt+ 18]?.files
                  // );
                  if (e.target.elements[lengtt + 11]?.files?.length !== 0) {
                    rcBookURL = await uploadImageCN(
                      e.target.elements[lengtt + 11]?.files[0]
                    );
                  }

                  if (e.target.elements[lengtt + 13]?.files?.length !== 0) {
                    drivingLicenesURL = await uploadImageCN(
                      e.target.elements[lengtt + 13]?.files[0]
                    );
                  }

                  if (e.target.elements[lengtt + 19]?.files?.length !== 0) {
                    bankPassbookURL = await uploadImageCN(
                      e.target.elements[lengtt + 19]?.files[0]
                    );
                  }

                  if (e.target.elements[lengtt + 21]?.files?.length !== 0) {
                    cancelledChequeURL = await uploadImageCN(
                      e.target.elements[lengtt + 21]?.files[0]
                    );
                  }

                  const documents = {
                    rcbook: rcBookURL,
                    drivinglicenes: drivingLicenesURL,
                    passbook: bankPassbookURL,
                    cheque: cancelledChequeURL,
                    bankdetails: {
                      bankName: e.target.elements[lengtt + 15].value,
                      accountNumber: e.target.elements[lengtt + 16].value,
                      ifscCode: e.target.elements[lengtt + 18].value,
                      branch: e.target.elements[lengtt + 17].value,
                    },
                  };
                  // const roles = ["Examiner", "Paper Setter", "Expert"];
                  // const roles = {
                  //   role: e.target.elements[lengtt+ 7].value,
                  // };
                  const object = {
                    id: data._id,
                    e_id: e.target.elements[0].value,
                    personalDetails,
                    instituteDetails,
                    documents,
                    roles,
                  };
                  const res = await updateExaminer({
                    user: object,
                  });
                  toast.dismiss(loading);

                  toast.success("Documents Uploaded");
                  history.push(
                    `/dashboard?search=${history.location.state.link}`
                  );
                }}
              >
                {/* <div className={styles.component}>
                <div className={styles.lable}>Institute Code</div>
                <input

                  name="InstituteCode"
                  type="text"
                  placeholder="Institute Code"
                />
              </div> */}
                <div className={styles.component}>
                  <div className={styles.lable}>Institute Code </div>

                  <select name="InstituteCode" defaultValue={data?.e_id}>
                    <option className={styles.lable} value="SOE">
                      SOE
                    </option>
                    <option className={styles.lable} value="SON">
                      SON
                    </option>
                    <option className={styles.lable} value="SOP">
                      SOP
                    </option>
                    <option className={styles.lable} value="SLM">
                      SLM
                    </option>
                  </select>
                </div>
                <div className={styles.component}>
                  <div className={styles.lable}>Name</div>
                  <input
                    name="Name"
                    className={styles.inputBox}
                    type="text"
                    placeholder="Name"
                    defaultValue={data?.personalDetails?.name}
                  />
                </div>
                <div className={styles.component}>
                  <div className={styles.lable}>Contact Number</div>
                  <input
                    className={styles.inputBox}
                    name="mobile"
                    type="text"
                    placeholder="Contact Number"
                    defaultValue={data?.personalDetails?.phonenumber}
                  />
                </div>
                <div className={styles.component}>
                  <div className={styles.lable}>Personal Email</div>
                  <input
                    className={styles.inputBox}
                    name="PersonalEmail"
                    type="email"
                    placeholder="Personal Email"
                    defaultValue={data?.personalDetails?.personalEmail}
                  />
                </div>
                <div className={styles.component}>
                  <div className={styles.lable}>Institute Email</div>
                  <input
                    className={styles.inputBox}
                    name="InstituteEmail"
                    type="email"
                    placeholder="Institute Email"
                    defaultValue={data?.personalDetails?.collegeemail}
                  />
                </div>
                <div
                  className={styles.component}
                  style={{
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    className={styles.lable}
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    Area of interest
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {/* <input
                      className={styles.inputBox}
                      name="areaOfInterest"
                      type="text"
                      placeholder="Area of interest"
                      defaultValue={data?.personalDetails?.areaofinterest}
                    /> */}

                    {areaOfInterest.map((item) => {
                      return (
                        <input
                          className={styles.inputBox}
                          name="areaOfInterest"
                          type="text"
                          placeholder="Area of interest"
                          defaultValue={item}
                        />
                      );
                    })}
                    <input
                      className={styles.inputBox}
                      name="areaOfInterest"
                      type="text"
                      placeholder="Area of interest"
                    />
                    <button
                      className={styles.button + " " + styles.add}
                      onClick={(e) => {
                        e.preventDefault();
                        const temp = areaOfInterest;
                        temp.push(e.target.previousSibling.value);
                        console.log(temp);
                        setAreaOfInterest([...temp]);
                        e.target.previousSibling.value = "";
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
                {data?.instituteDetails && (
                  <div>
                    <div>
                      <div className={styles.component}>
                        <div className={styles.lable}>Institute Name</div>
                        {Universities && (
                          <select
                            name="institute"
                            defaultValue={data?.instituteDetails?.institutename}
                          >
                            <option
                              className={styles.lable}
                              value="P P Savani School of Engineering, Kosamba"
                            >
                              P P Savani School of Engineering, Kosamba
                            </option>
                            {Universities.map((item, index) => {
                              return (
                                <option
                                  className={styles.lable}
                                  value={item.name}
                                >
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                        )}
                      </div>
                    </div>

                    <div className={styles.component}>
                      <div className={styles.lable}>Category </div>

                      <select
                        name="category"
                        // default value
                        defaultValue={data?.instituteDetails?.role}
                        onChange={(e) => {}}
                      >
                        <option className={styles.lable} value="NA">
                          NA
                        </option>
                        <option
                          className={styles.lable}
                          value="Teaching Assistant"
                        >
                          Teaching Assistant
                        </option>
                        <option
                          className={styles.lable}
                          value="Assistant professor"
                        >
                          Assistant professor
                        </option>
                        <option
                          className={styles.lable}
                          value="Associate professor"
                        >
                          Associate professor
                        </option>
                        <option className={styles.lable} value="Professor">
                          Professor
                        </option>
                      </select>
                    </div>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    marginTop: "20px",
                    marginBottom: "0px",
                  }}
                >
                  <div
                    className={styles.lable}
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Category
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    fontFamily: "Poppins",
                    minWidth: "100px",
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "flex-start",
                    //   alignItems: "flex-start",
                  }}
                  className={styles.component}
                >
                  {" "}
                  <div
                    style={{
                      width: "100%",
                    }}
                  >
                    Examiner{" "}
                  </div>
                  <input
                    style={{
                      width: "20px",
                    }}
                    type={"checkbox"}
                    defaultChecked={
                      data?.roles?.includes("Examiner") ||
                      data?.roles?.includes("Paper Setter & Examiner")
                    }
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    fontFamily: "Poppins",
                    minWidth: "100px",
                    marginTop: "10px",
                    display: "flex",
                    //   justifyContent: "flex-start",
                    //   alignItems: "flex-start",
                  }}
                  className={styles.component}
                >
                  {" "}
                  <div
                    style={{
                      width: "100%",
                    }}
                  >
                    Paper setter{" "}
                  </div>
                  <input
                    style={{
                      width: "20px",
                    }}
                    type={"checkbox"}
                    defaultChecked={
                      data?.roles?.includes("Paper Setter ") ||
                      data?.roles?.includes("Paper Setter") ||
                      data?.roles?.includes("Paper Setter & Examiner")
                    }
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    fontFamily: "Poppins",

                    marginTop: "10px",
                  }}
                  className={styles.component}
                >
                  <div>Expert </div>
                  <input
                    style={{
                      width: "20px",
                    }}
                    type={"checkbox"}
                    defaultChecked={data?.roles?.includes("Expert")}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    marginTop: "20px",
                    marginBottom: "0px",
                  }}
                >
                  <div
                    className={styles.lable}
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Documents
                  </div>
                </div>
                <div className={styles.component}>
                  <div className={styles.lable}>RC Book (PNG or JPEG)</div>

                  <input
                    className={styles.inputBox}
                    name="rcBook"
                    type="file"
                    accept="image/*"
                    placeholder="Upload Resume"
                  />
                  <button
                    disabled={!data?.documents?.rcbook}
                    style={{
                      backgroundColor: data?.documents?.rcbook ? "" : "red",
                    }}
                    className={styles.button + " " + styles.add}
                    onClick={(e) => {
                      e.preventDefault();
                      setPopupImage(data?.documents?.rcbook);
                      setPopupOpen(true);
                    }}
                  >
                    Open
                  </button>
                </div>
                <div className={styles.component}>
                  <div className={styles.lable}>
                    Driving Licence (PNG or JPEG)
                  </div>

                  <input
                    className={styles.inputBox}
                    name="drivingLicenes"
                    type="file"
                    accept="image/*"
                    placeholder="Upload Resume"
                  />
                  <button
                    disabled={!data?.documents?.drivinglicenes}
                    style={{
                      backgroundColor: data?.documents?.drivinglicenes
                        ? ""
                        : "red",
                    }}
                    className={styles.button + " " + styles.add}
                    onClick={(e) => {
                      e.preventDefault();
                      setPopupImage(data?.documents?.rcbook);
                      setPopupOpen(true);
                    }}
                  >
                    Open
                  </button>
                </div>{" "}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    marginTop: "20px",
                    marginBottom: "0px",
                  }}
                >
                  <div
                    className={styles.lable}
                    style={{
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    Bank Details
                  </div>
                </div>
                <div className={styles.component}>
                  <div className={styles.lable}>Bank Name</div>
                  <input
                    className={styles.inputBox}
                    name="bankName"
                    type="text"
                    placeholder="Bank Name"
                    defaultValue={data?.documents?.bankdetails?.bankName}
                  />
                </div>
                <div className={styles.component}>
                  <div className={styles.lable}>Account No.</div>
                  <input
                    className={styles.inputBox}
                    name="accountNumber"
                    type="text"
                    placeholder="Account Number"
                    defaultValue={data?.documents?.bankdetails?.accountNumber}
                  />
                </div>
                <div className={styles.component}>
                  <div className={styles.lable}>Branch</div>
                  <input
                    className={styles.inputBox}
                    name="branch"
                    type="text"
                    placeholder="Bank Branch"
                    defaultValue={data?.documents?.bankdetails?.branch}
                  />
                </div>
                <div className={styles.component}>
                  <div className={styles.lable}>IFSC Code</div>
                  <input
                    className={styles.inputBox}
                    name="ifscCode"
                    type="text"
                    placeholder="IFSC Code"
                    defaultValue={data?.documents?.bankdetails?.ifscCode}
                  />
                </div>
                <div className={styles.component}>
                  <div className={styles.lable}>
                    Bank passbook (PNG or JPEG)
                  </div>
                  <input
                    className={styles.inputBox}
                    name="bankPassbook"
                    type="file"
                    accept="image/*"
                    placeholder="Upload Resume"
                  />
                  <button
                    disabled={!data?.documents?.passbook}
                    style={{
                      backgroundColor: data?.documents?.passbook ? "" : "red",
                    }}
                    className={styles.button + " " + styles.add}
                    onClick={(e) => {
                      e.preventDefault();
                      setPopupImage(data?.documents?.passbook);
                      setPopupOpen(true);
                    }}
                  >
                    Open
                  </button>
                </div>
                <div className={styles.component}>
                  <div className={styles.lable}>
                    Cancelled cheque (PNG or JPEG)
                  </div>
                  <input
                    className={styles.inputBox}
                    name="cancelledCheque"
                    type="file"
                    accept="image/*"
                    placeholder="Upload Resume"
                  />
                  <button
                    disabled={!data?.documents?.cheque}
                    style={{
                      backgroundColor: data?.documents?.cheque ? "" : "red",
                    }}
                    className={styles.button + " " + styles.add}
                    onClick={(e) => {
                      e.preventDefault();
                      setPopupImage(data?.documents?.cheque);
                      setPopupOpen(true);
                    }}
                  >
                    Open
                  </button>
                </div>
                <div className={styles.submitWrapper}>
                  <div>
                    <input
                      className={styles.submit}
                      type={"submit"}
                      value={"Submit"}
                    />
                  </div>
                </div>
              </form>
            </div>
            <ImagePopup
              open={popupOpen}
              link={popupImage}
              closePopup={() => {
                setPopupOpen(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Edit;
