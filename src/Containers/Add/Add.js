import React from "react";
import Header from "../../Components/Header";
import styles from "./Add.module.css";
import logo from "../../Assets/General/Images/logo.png";
import { uploadImage } from "../../Services/storage.service";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { Cookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import { addExaminer, getUniversities } from "../../Services/admin.service";

function Add() {
  const history = useHistory();
  const [Universities, setUniversity] = React.useState(null);
  const uploadImageCN = async (file) => {
    const URL = await uploadImage(file).then((res) => {
      return res[0];
    });
    return URL;
  };
  useEffect(async () => {
    const cookie = new Cookies();
    const token = cookie.get("token-ex");
    if (!token) {
      history.push("/");
    }
    const res = await getUniversities();
    setUniversity(res);
  }, []);
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
                  areaofinterest: e.target.elements[5].value,
                };
                const instituteDetails = {
                  institutename: e.target.elements[6].value,
                  role: e.target.elements[7].value,
                };
                let roles = [];
                if (e.target.elements[8].checked) {
                  roles.push("Examiner");
                }
                if (e.target.elements[9].checked) {
                  roles.push("Paper Setter");
                }
                if (e.target.elements[10].checked) {
                  roles.push("Expert");
                }

                let rcBook = e.target.elements[11].files[0];
                let drivingLicenes = e.target.elements[12].files[0];
                let bankPassbook = e.target.elements[16].files[0];
                let cancelledCheque = e.target.elements[17].files[0];
                let loading = toast.loading("Uploading Documents");
                let rcBookURL = await uploadImageCN(rcBook);
                let drivingLicenesURL = await uploadImageCN(drivingLicenes);
                let bankPassbookURL = await uploadImageCN(bankPassbook);
                let cancelledChequeURL = await uploadImageCN(cancelledCheque);

                const documents = {
                  rcbook: rcBookURL,
                  drivinglicenes: drivingLicenesURL,
                  passbook: bankPassbookURL,
                  cheque: cancelledChequeURL,
                  bankdetails: {
                    bankName: e.target.elements[13].value,
                    accountNumber: e.target.elements[14].value,
                    ifscCode: e.target.elements[15].value,
                  },
                };

                // const roles = ["Examiner", "Paper Setter", "Expert"];
                // const roles = {
                //   role: e.target.elements[7].value,
                // };
                const object = {
                  e_id: e.target.elements[0].value,
                  personalDetails,
                  instituteDetails,
                  documents,
                  roles,
                };
                const uploading = await addExaminer({ user: object });
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

                <select name="InstituteCode">
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
                />
              </div>
              <div className={styles.component}>
                <div className={styles.lable}>Contact Number</div>
                <input
                  className={styles.inputBox}
                  name="mobile"
                  type="text"
                  placeholder="Contact Number"
                />
              </div>
              <div className={styles.component}>
                <div className={styles.lable}>Personal Email</div>
                <input
                  className={styles.inputBox}
                  name="PersonalEmail"
                  type="email"
                  placeholder="Personal Email"
                />
              </div>
              <div className={styles.component}>
                <div className={styles.lable}>Institute Email</div>
                <input
                  className={styles.inputBox}
                  name="InstituteEmail"
                  type="email"
                  placeholder="Institute Email"
                  required
                />
              </div>
              <div className={styles.component}>
                <div className={styles.lable}>Area of interest</div>
                <input
                  className={styles.inputBox}
                  name="areaOfInterest"
                  type="text"
                  placeholder="Area of interest"
                />
              </div>
              <div>
                <div className={styles.component}>
                  <div className={styles.lable}>Institute Name</div>
                  {Universities && (
                    <select name="institute">
                      <option
                        className={styles.lable}
                        value="P P Savani School of Engineering, Kosamba"
                      >
                        P P Savani School of Engineering, Kosamba
                      </option>
                      {Universities.map((item, index) => {
                        return (
                          <option className={styles.lable} value={item.name}>
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

                <select name="category">
                  <option className={styles.lable} value="Teaching Assistant">
                    Teaching Assistant
                  </option>
                  <option className={styles.lable} value="Assistant professor">
                    Assistant professor
                  </option>
                  <option className={styles.lable} value="Associate professor">
                    Associate professor
                  </option>
                  <option className={styles.lable} value="Professor">
                    Professor
                  </option>
                </select>
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
                  Paper setter & Examiner{" "}
                </div>
                <input
                  style={{
                    width: "20px",
                  }}
                  type={"checkbox"}
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
                <div className={styles.lable}>RC Book</div>
                <input
                  className={styles.inputBox}
                  name="rcBook"
                  type="file"
                  accept="image/*"
                  placeholder="Upload Resume"
                />
              </div>
              <div className={styles.component}>
                <div className={styles.lable}>Driving Licence</div>
                <input
                  className={styles.inputBox}
                  name="drivingLicenes"
                  type="file"
                  accept="image/*"
                  placeholder="Upload Resume"
                />
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
                />
              </div>
              <div className={styles.component}>
                <div className={styles.lable}>Account No.</div>
                <input
                  className={styles.inputBox}
                  name="accountNumber"
                  type="text"
                  placeholder="Account Number"
                />
              </div>
              <div className={styles.component}>
                <div className={styles.lable}>IFSC Code</div>
                <input
                  className={styles.inputBox}
                  name="ifscCode"
                  type="text"
                  placeholder="IFSC Code"
                />
              </div>
              <div className={styles.component}>
                <div className={styles.lable}>Bank passbook</div>
                <input
                  className={styles.inputBox}
                  name="bankPassbook"
                  accept="image/*"
                  type={"file"}
                  placeholder="Bank Passbook"
                />
              </div>
              <div className={styles.component}>
                <div className={styles.lable}>Cancelled cheque</div>
                <input
                  className={styles.inputBox}
                  name="cancelledCheque"
                  type="file"
                  accept="image/*"
                  placeholder="Bank Passbook"
                />
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
        </div>
      </div>
    </div>
  );
}

export default Add;
