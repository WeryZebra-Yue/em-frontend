import React from "react";
import Header from "../../Components/Header";
import styles from "./Open.module.css";
import logo from "../../Assets/General/Images/logo.png";
import { uploadImage } from "../../Services/storage.service";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Cookies } from "react-cookie";
import { useEffect } from "react";
import ImagePopup from "../../Components/Popup";
import { getUniversities } from "../../Services/admin.service";

function Open() {
  const history = useHistory();
  const [data, setData] = React.useState(null);
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [popupImage, setPopupImage] = React.useState(false);
  const [distance, setDistance] = React.useState(-1);
  useEffect(async () => {
    const cookie = new Cookies();
    const token = cookie.get("token-ex");
    if (!token) {
      window.location.href = "/";
    }
    if (history.location.state.row?._id) {
      setData(history.location.state.row);
      const university = await getUniversities();

      university.map((item) => {
        if (
          history.location.state.row.instituteDetails.institutename ===
          item.name
        ) {
          setDistance(item.distance);
        }
      });
      if (distance === -1) {
        if (
          history.location.state.row.instituteDetails.institutename ===
          "P P Savani School of Engineering, Kosamba"
        ) {
          setDistance(0);
        }
      }
    } else {
      // history.push("/dashboard");
    }
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
        <div className={styles.loginText}>Examiner Details</div>
        <div className={styles.formWrapper}>
          <div>
            <div className={styles.form}>
              <div className={styles.component} title="Click to Copy">
                <div className={styles.lable}>Institute Code </div>

                <div
                  onClick={() => {
                    // copy to clipboard
                    navigator.clipboard.writeText(data?.e_id);
                    toast.success("Copied to clipboard");
                  }}
                  className={styles.inputBox}
                  required
                  name="InstituteCode"
                  type="text"
                  placeholder="Institute Code"
                  value={data?.e_id}
                  disabled={!data?.e_id}
                  style={{
                    background: data?.e_id ? "white" : "",
                    color: data?.e_id ? "black" : "rgb(84, 84, 84)",
                  }}
                >
                  {data?.e_id}{" "}
                </div>
              </div>
              <div className={styles.component} title="Click to Copy">
                <div className={styles.lable}>Name</div>
                <div
                  onClick={() => {
                    // copy to clipboard
                    navigator.clipboard.writeText(data?.personalDetails.name);
                    toast.success("Copied to clipboard");
                  }}
                  required
                  name="Name"
                  className={styles.inputBox}
                  type="text"
                  placeholder="Name"
                  value={data?.personalDetails.name}
                  disabled={data?.personalDetails.name}
                  style={{
                    background: data?.personalDetails.name ? "white" : "",
                    color: data?.personalDetails.name
                      ? "black"
                      : "rgb(84, 84, 84)",
                  }}
                >
                  {" "}
                  {data?.personalDetails.name
                    ? data?.personalDetails.name
                    : "Name"}
                </div>
              </div>
              <div className={styles.component} title="Click to Copy">
                <div className={styles.lable}>Contact Number</div>
                <div
                  onClick={() => {
                    // copy to clipboard
                    navigator.clipboard.writeText(
                      data?.personalDetails.phonenumber
                    );
                    toast.success("Copied to clipboard");
                  }}
                  className={styles.inputBox}
                  required
                  name="mobile"
                  type="text"
                  placeholder="Contact Number"
                  value={data?.personalDetails.phonenumber}
                  disabled={!data?.personalDetails.phonenumber}
                  style={{
                    background: data?.personalDetails.phonenumber
                      ? "white"
                      : "",
                    color: data?.personalDetails.phonenumber
                      ? "black"
                      : "rgb(84, 84, 84)",
                  }}
                >
                  {" "}
                  {data?.personalDetails.phonenumber
                    ? data?.personalDetails.phonenumber
                    : "Contact Number"}
                </div>
              </div>
              <div className={styles.component} title="Click to Copy">
                <div className={styles.lable}>Personal Email</div>
                <div
                  onClick={() => {
                    // copy to clipboard
                    navigator.clipboard.writeText(
                      data?.personalDetails.personalEmail
                    );
                    toast.success("Copied to clipboard");
                  }}
                  className={styles.inputBox}
                  required
                  name="PersonalEmail"
                  type="email"
                  placeholder="Personal Email"
                  value={data?.personalDetails.personalEmail}
                  disabled={!data?.personalDetails.personalEmail}
                  style={{
                    background: data?.personalDetails.personalEmail
                      ? "white"
                      : "",
                    color: data?.personalDetails.personalEmail
                      ? "black"
                      : "rgb(84, 84, 84)",
                  }}
                >
                  {" "}
                  {data?.personalDetails.personalEmail
                    ? data?.personalDetails.personalEmail
                    : "Personal Email"}
                </div>
              </div>
              <div className={styles.component} title="Click to Copy">
                <div className={styles.lable}>Institute Email</div>
                <div
                  onClick={() => {
                    // copy to clipboard
                    navigator.clipboard.writeText(
                      data?.personalDetails.collegeemail
                    );
                    toast.success("Copied to clipboard");
                  }}
                  className={styles.inputBox}
                  required
                  name="InstituteEmail"
                  type="email"
                  placeholder="Institute Email"
                  value={data?.personalDetails.collegeemail}
                  disabled={!data?.personalDetails.collegeemail}
                  style={{
                    background: data?.personalDetails.collegeemail
                      ? "white"
                      : "",
                    color: data?.personalDetails.collegeemail
                      ? "black"
                      : "rgb(84, 84, 84)",
                  }}
                >
                  {" "}
                  {data?.personalDetails.collegeemail
                    ? data?.personalDetails.collegeemail
                    : "Institute Email"}
                </div>
              </div>
              <div className={styles.component} title="Click to Copy">
                <div
                  className={styles.lable}
                  style={{
                    width: "100%",
                  }}
                >
                  Area of interest
                </div>
                {/* <div
                  onClick={() => {
                    // copy to clipboard
                    navigator.clipboard.writeText(
                      data?.personalDetails.areaofinterest
                    );
                    toast.success("Copied to clipboard");
                  }}
                  className={styles.inputBox}
                  required
                  name="areaOfInterest"
                  type="text"
                  placeholder="Area of interest"
                  value={data?.personalDetails.areaofinterest}
                  disabled={!data?.personalDetails.areaofinterest}
                  style={{
                    background: data?.personalDetails.areaofinterest
                      ? "white"
                      : "",
                    color: data?.personalDetails.areaofinterest
                      ? "black"
                      : "rgb(84, 84, 84)",
                  }}
                >
                  {" "}
                  {data?.personalDetails.areaofinterest
                    ? data?.personalDetails.areaofinterest
                    : "Area of interest"}
                </div> */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: "Poppins",
                    width: "100%",
                    gap: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className={styles.component}
                >
                  {data?.personalDetails.areaofinterest &&
                    data?.personalDetails.areaofinterest.map((item) => {
                      return (
                        <div
                          style={{
                            width: "90%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "white",
                            borderRadius: "5px",
                            padding: "5px",
                          }}
                        >
                          {item}
                        </div>
                      );
                    })}
                </div>
              </div>
              <div>
                <div className={styles.component} title="Click to Copy">
                  <div className={styles.lable}>Institute Name</div>
                  <div
                    onClick={() => {
                      // copy to clipboard
                      navigator.clipboard.writeText(
                        data?.instituteDetails.institutename
                      );
                      toast.success("Copied to clipboard");
                    }}
                    className={styles.inputBox}
                    required
                    name="InstituteName"
                    type="text"
                    placeholder="Institute Name"
                    value={data?.instituteDetails.institutename}
                    disabled={!data?.instituteDetails.institutename}
                    style={{
                      background: data?.instituteDetails.institutename
                        ? "white"
                        : "",
                      color: data?.instituteDetails.institutename
                        ? "black"
                        : "rgb(84, 84, 84)",
                    }}
                  >
                    {" "}
                    {data?.instituteDetails.institutename
                      ? data?.instituteDetails.institutename
                      : "Institute Name"}
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.component} title="Click to Copy">
                  <div className={styles.lable}>Distance</div>
                  <div
                    onClick={() => {
                      // copy to clipboard
                      navigator.clipboard.writeText(
                        data?.instituteDetails.institutename
                      );
                      toast.success("Copied to clipboard");
                    }}
                    className={styles.inputBox}
                    required
                    name="InstituteName"
                    type="text"
                    placeholder="Institute Name"
                    value={data?.instituteDetails.institutename}
                    disabled={!data?.instituteDetails.institutename}
                    style={{
                      background: data?.instituteDetails.institutename
                        ? "white"
                        : "",
                      color: data?.instituteDetails.institutename
                        ? "black"
                        : "rgb(84, 84, 84)",
                    }}
                  >
                    {" "}
                    {distance !== -1 ? distance : "N / A"}
                  </div>
                </div>
              </div>
              <div className={styles.component} title="Click to Copy">
                <div className={styles.lable}>Category </div>
                <div
                  onClick={() => {
                    // copy to clipboard
                    navigator.clipboard.writeText(data?.instituteDetails.role);
                    toast.success("Copied to clipboard");
                  }}
                  className={styles.inputBox}
                  required
                  name="InstituteName"
                  type="text"
                  placeholder="Role of the examiner"
                  value={data?.instituteDetails.role}
                  disabled={!data?.instituteDetails.role}
                  style={{
                    background: data?.instituteDetails.role ? "white" : "",
                    color: data?.instituteDetails.role
                      ? "black"
                      : "rgb(84, 84, 84)",
                  }}
                >
                  {" "}
                  {data?.instituteDetails.role
                    ? data?.instituteDetails.role
                    : "Role of the examiner"}
                </div>
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
                  checked={
                    data?.roles.includes("Examiner") ||
                    data?.roles.includes("Paper Setter & Examiner")
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
                  Paper setter
                </div>
                <input
                  style={{
                    width: "20px",
                  }}
                  checked={
                    data?.roles.includes("Paper Setter ") ||
                    data?.roles.includes("Paper Setter") ||
                    data?.roles.includes("Paper Setter & Examiner")
                  }
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
                  checked={data?.roles.includes("Expert")}
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
              <div className={styles.component} title="Click to Copy">
                <div className={styles.lable}>RC Book</div>

                <button
                  disabled={!data?.documents?.rcbook}
                  style={{
                    backgroundColor: data?.documents?.rcbook ? "" : "red",
                  }}
                  className={styles.button + " " + styles.add}
                  onClick={() => {
                    setPopupImage(data?.documents?.rcbook);
                    setPopupOpen(true);
                  }}
                >
                  Open
                </button>
              </div>
              <div className={styles.component} title="Click to Copy">
                <div className={styles.lable}>Driving Licence</div>
                <button
                  disabled={!data?.documents?.drivinglicenes}
                  style={{
                    backgroundColor: data?.documents?.drivinglicenes
                      ? ""
                      : "red",
                  }}
                  className={styles.button + " " + styles.add}
                  onClick={() => {
                    setPopupImage(data?.documents?.drivinglicenes);
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
              <div className={styles.component} title="Click to Copy">
                <div className={styles.lable}>Bank Name</div>
                <div
                  onClick={() => {
                    // copy to clipboard
                    navigator.clipboard.writeText(
                      data?.documents?.bankdetails?.bankName
                    );
                    toast.success("Copied to clipboard");
                  }}
                  className={styles.inputBox}
                  required
                  name="bankName"
                  type="text"
                  placeholder="Bank Name"
                  value={data?.documents?.bankdetails?.bankName}
                  disabled={!data?.documents?.bankdetails?.bankName}
                  style={{
                    background: data?.documents?.bankdetails?.bankName
                      ? "white"
                      : "",
                    color: data?.documents?.bankdetails?.bankName
                      ? "black"
                      : "rgb(84, 84, 84)",
                  }}
                >
                  {data?.documents?.bankdetails?.bankName
                    ? data?.documents?.bankdetails?.bankName
                    : "Bank Name"}
                </div>
              </div>
              <div className={styles.component} title="Click to Copy">
                <div className={styles.lable}>Bank Name</div>
                <div
                  onClick={() => {
                    // copy to clipboard
                    navigator.clipboard.writeText(
                      data?.documents?.bankdetails?.branch
                    );
                    toast.success("Copied to clipboard");
                  }}
                  className={styles.inputBox}
                  required
                  name="branch"
                  type="text"
                  placeholder="Bank Name"
                  value={data?.documents?.bankdetails?.branch}
                  disabled={!data?.documents?.bankdetails?.branch}
                  style={{
                    background: data?.documents?.bankdetails?.branch
                      ? "white"
                      : "",
                    color: data?.documents?.bankdetails?.branch
                      ? "black"
                      : "rgb(84, 84, 84)",
                  }}
                >
                  {data?.documents?.bankdetails?.branch
                    ? data?.documents?.bankdetails?.branch
                    : "Branch"}
                </div>
              </div>
              <div className={styles.component} title="Click to Copy">
                <div className={styles.lable}>Account No.</div>
                <div
                  onClick={() => {
                    // copy to clipboard
                    navigator.clipboard.writeText(
                      data?.documents?.bankdetails?.accountNumber
                    );
                    toast.success("Copied to clipboard");
                  }}
                  className={styles.inputBox}
                  required
                  name="accountNumber"
                  type="text"
                  placeholder="Account Number"
                  value={data?.documents?.bankdetails?.accountNumber}
                  disabled={!data?.documents?.bankdetails?.accountNumber}
                  style={{
                    background: data?.documents?.bankdetails?.accountNumber
                      ? "white"
                      : "",
                    color: data?.documents?.bankdetails?.accountNumber
                      ? "black"
                      : "rgb(84, 84, 84)",
                  }}
                >
                  {data?.documents?.bankdetails?.accountNumber
                    ? data?.documents?.bankdetails?.accountNumber
                    : "Account Number"}
                </div>
              </div>
              <div className={styles.component} title="Click to Copy">
                <div className={styles.lable}>IFSC Code</div>
                <div
                  onClick={() => {
                    // copy to clipboard
                    navigator.clipboard.writeText(
                      data?.documents?.bankdetails?.ifscCode
                    );
                    toast.success("Copied to clipboard");
                  }}
                  className={styles.inputBox}
                  required
                  name="ifscCode"
                  type="text"
                  placeholder="IFSC Code"
                  value={data?.documents?.bankdetails?.ifscCode}
                  disabled={!data?.documents?.bankdetails?.ifscCode}
                  style={{
                    background: data?.documents?.bankdetails?.ifscCode
                      ? "white"
                      : "",
                    color: data?.documents?.bankdetails?.ifscCode
                      ? "black"
                      : "rgb(84, 84, 84)",
                  }}
                >
                  {data?.documents?.bankdetails?.ifscCode
                    ? data?.documents?.bankdetails?.ifscCode
                    : "IFSC Code"}
                </div>
              </div>
              <div className={styles.component} title="Click to Copy">
                <div className={styles.lable}>Bank passbook</div>
                <button
                  disabled={!data?.documents?.passbook}
                  style={{
                    backgroundColor: data?.documents?.passbook ? "" : "red",
                  }}
                  className={styles.button + " " + styles.add}
                  onClick={() => {
                    setPopupImage(data?.documents?.passbook);
                    setPopupOpen(true);
                  }}
                >
                  Open
                </button>
              </div>
              <div className={styles.component} title="Click to Copy">
                <div className={styles.lable}>Cancelled cheque</div>
                <button
                  disabled={!data?.documents?.cheque}
                  style={{
                    backgroundColor: data?.documents?.cheque ? "" : "red",
                  }}
                  className={styles.button + " " + styles.add}
                  onClick={() => {
                    setPopupImage(data?.documents?.cheque);
                    setPopupOpen(true);
                  }}
                >
                  Open
                </button>
              </div>
              {/* <div className={styles.submitWrapper}>
                <div>
                  <div
                  onClick={() => {
                    // copy to clipboard
                    navigator.clipboard.writeText(data?.e_id);
                    toast.success("Copied to clipboard");
                  }}

                    required
                    className={styles.submit}
                    type={"submit"}
                    value={"Submit"}
                  />
                </div>
              </div> */}
            </div>
            <ImagePopup
              open={popupOpen}
              link={popupImage}
              closePopup={() => {
                setPopupOpen(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Open;
