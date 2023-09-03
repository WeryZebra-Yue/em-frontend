import React from "react";
import styles from "./ListItem.module.css";
import eye from "../../Assets/ListItem/Images/eye.svg";
import { useEffect } from "react";
import { getPassword, updateAdmin } from "../../Services/admin.service";
import { toast } from "react-toastify";
function ListItem({
  email,
  passwordLength,
  password,
  index,
  role,
  getPasswordForUser,
}) {
  const [password_eye, showPassword] = React.useState(false);
  const PasswordMaker = (length) => {
    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      password += "*";
    }
    return password;
  };
  useEffect(() => {});
  return (
    <div>
      {/* <div className={styles.email}>{email}@ppsu.db</div>
      <div className={styles.passwordLength}>{passwordLength}</div>
      <div className={styles.password}>{password}</div> */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = {
            email: email,
            password: e.target.password.value,
            role: e.target.role.value,
          };
          const object = {
            email: email,
            password: password,
            role: role,
          };

          if (object.password !== data.password || object.role !== data.role) {
            updateAdmin(data).then((res) => {
              toast.success("Updated Successfully");
            });
          } else {
            toast.error("No Changes Made");
          }
        }}
      >
        <div className={styles.component}>
          <div
            className={
              styles.lable +
              " " +
              `${email === "developer@ppsu.db" ? styles.dev : ""}`
            }
          >
            {index + 1}.
          </div>
          <div
            required
            name="Name"
            className={
              styles.inputBox +
              " " +
              `${email === "developer@ppsu.db" ? styles.dev : ""}`
            }
            type="text"
            id="email"
            placeholder="Name"
            style={{
              textAlign: "left",
              background: email === "developer@ppsu.db" ? "" : "white",
              margin: "10px",
              marginBottom: "20px",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
            // value={}
            disabled={email === "developer@ppsu.db" ? true : false}
          >
            {email}
          </div>

          <input
            required
            type={!password_eye ? "password" : "text"}
            className={styles.inputBox}
            placeholder="Password"
            disabled={email === "developer@ppsu.db" ? true : false}
            defaultValue={password}
            id="password"
          />
          <div className={styles.component}>
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
          </div>
          <button
            // disabled={!data?.documents?.rcbook}
            // style={{
            //   backgroundColor: data?.documents?.rcbook ? "" : "red",
            // }}

            className={
              styles.button +
              " " +
              `${email === "developer@ppsu.db" ? styles.dev : ""}`
            }
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

export default ListItem;
