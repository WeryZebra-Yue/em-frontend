import React from "react";
import styles from "./ListUniversity.module.css";
import eye from "../../Assets/ListItem/Images/eye.svg";
import { useEffect } from "react";
import {
  getPassword,
  updateAdmin,
  updateUniversity,
} from "../../Services/admin.service";
import { toast } from "react-toastify";
function ListUniversity({ name, distance, index, _id }) {
  const [password_eye, showPassword] = React.useState(false);

  useEffect(() => {});
  return (
    <div>
      {/* <div className={styles.email}>{email}@ppsu.db</div>
      <div className={styles.passwordLength}>{passwordLength}</div>
      <div className={styles.password}>{password}</div> */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (e.target.distance.value === distance) {
            toast.error("No Changes Made");
            return;
          } else {
            await updateUniversity({
              _id: _id,
              distance: e.target.distance.value,
            }).then((res) => {
              toast.success("Updated Successfully");
            });
          }
        }}
      >
        <div className={styles.component}>
          <div className={styles.lable + " "}>{index + 1}.</div>
          <div
            required
            name="Name"
            className={
              styles.inputBox + " "
              //   `${email === "developer@ppsu.db" ? styles.dev : ""}`
            }
            type="text"
            id="email"
            placeholder="Name"
            style={{
              textAlign: "left",
              //   background: email === "developer@ppsu.db" ? "" : "white",
              margin: "10px",
              marginBottom: "20px",
            }}
            // value={}
          >
            {name}
          </div>

          <input
            required
            type={"text"}
            className={styles.inputBox}
            placeholder="Distance"
            // disabled={email === "developer@ppsu.db" ? true : false}
            defaultValue={distance}
            id="distance"
          />
          {/* <div className={styles.component}>
            <select
              name="role"
              id="role"
              disabled={email === "developer@ppsu.db" ? true : false}
              defaultValue={email === "developer@ppsu.db" ? "WRITE" : role}
              className={`${email === "developer@ppsu.db" ? styles.dev : ""}`}
            >
              <option className={styles.lable} value="READ">
                READ
              </option>
              <option className={styles.lable} value="WRITE">
                READ & WRITE
              </option>
            </select>
          </div>
          <div
            onClick={() => {
              showPassword(!password_eye);
            }}
            className={
              `${email === "developer@ppsu.db" ? styles.eyedev : styles.eye}` +
              " " +
              `${email === "developer@ppsu.db" ? styles.dev : ""}`
            }
          >
            <img src={eye} alt="eye" />
          </div> */}
          <button
            // disabled={!data?.documents?.rcbook}
            // style={{
            //   backgroundColor: data?.documents?.rcbook ? "" : "red",
            // }}

            className={styles.button + " "}
            // onClick={() => {
            //   setPopupImage(data?.documents?.rcbook);
            //   setPopupOpen(true);
            // }}
          >
            Change
          </button>
        </div>
      </form>
    </div>
  );
}

export default ListUniversity;
