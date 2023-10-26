import React from "react";
import Button from "../../Button";
import styles from "./User.module.css";

import eye from "../../../assets/Items/eye.svg";
import { CircularProgress } from "@mui/material";

import { toastify } from "../../../utils/general.helper";
import { updateAdmin } from "../../../services/admin.service";

function User({
  email,
  password,
  index,
  role,
  setCredentials,
  getPasswordForUser,
}: any) {
  const [dev] = React.useState(email === "developer@ppsu.db");
  const [role_, setRole] = React.useState<string | null>(null);
  const [password_, setPassword] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [password_eye, showPassword] = React.useState(false);
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          const req = {
            email: email,
            password: password_ ? password_ : password,
            role: role_ ? role_ : role,
          };
          if (!(password || role)) return;
          if (req.password !== password || req.role !== role) {
            updateAdmin(req).then(() => {
              setLoading(false);
              toastify("Password changed successfully", "success");
              setCredentials({
                email: email,
                password: req.password,
                role: req.role,
              });
            });
          } else {
            setLoading(false);

            toastify("No changes made", "info");
          }
        }}
      >
        <div className={styles.component}>
          <div className={styles.lable + " " + `${dev ? styles.dev : ""}`}>
            {index + 1}.
          </div>
          <div
            className={styles.inputBox + " " + `${dev ? styles.dev : ""}`}
            style={{
              textAlign: "left",
              margin: "10px",
              marginBottom: "20px",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {email}
          </div>

          <input
            required
            type={!password_eye ? "password" : "text"}
            className={styles.inputBox}
            placeholder="Password"
            disabled={dev ? true : false}
            defaultValue={password}
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
              getPasswordForUser(e.target.value, index);
            }}
          />
          <div className={styles.component}>
            <select
              name="role"
              id="role"
              disabled={dev ? true : false}
              defaultValue={dev ? "WRITE" : role}
              className={`${dev ? styles.dev : ""}`}
              onChange={(e) => {
                setRole(e.target.value);
              }}
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
              `${dev ? styles.eyedev : styles.eye}` +
              " " +
              `${dev ? styles.dev : ""}`
            }
          >
            <img src={eye} alt="eye" />
          </div>
          <Button
            type="submit"
            variant="outlined"
            disabled={!(password || role) || dev}
            className={`${styles.button} ${dev ? styles.dev : ""}`}
            style={{ width: "100px" }}
          >
            {loading ? (
              <CircularProgress size={25} color="inherit" thickness={5} />
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default User;
