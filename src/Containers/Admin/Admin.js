import { useSelector } from "react-redux";
import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import styles from "./Admin.module.css";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";
import Header from "../../Components/Header/index";
import {
  addAdmin,
  addUniversity,
  AuthService,
  getAdmins,
  getPassword,
  getUniversities,
  verifyToken,
} from "../../Services/admin.service";
import { useHistory } from "react-router-dom";
import { Cookies } from "react-cookie";
import logo from "../../Assets/General/Images/logo.png";
import { useState } from "react";
import ListItem from "../../Components/ListItem";
import eye from "../../Assets/ListItem/Images/eye.svg";
import ListUniversity from "../../Components/ListUniversity";

const Admin = () => {
  // const toast = useToast();
  const [Captacha, setCaptacha] = React.useState(false);
  const [password, showPassword] = useState(false);
  const [Credentials, setCredentials] = useState([
    {
      email: "developer@ppsu.db",
      passwordLength: 8,
      password: "",
      role: "WRITE",
    },
  ]);
  const [University, setUniversity] = useState([
    {
      name: "P P Savani School of Engineering, Kosamba",
      distance: 0,
    },
  ]);
  const history = useHistory();
  useEffect(async () => {
    const cookie = new Cookies();

    if (!cookie.get("token-ex")) {
      history.push("/");
    } else {
      const verify = await verifyToken(cookie.get("token-ex"));
      if (!verify.admin) {
        history.push("/dashboard");
        return;
      } else {
        await getAdmins().then((res) => {
          console.log(res);
          if (Credentials.length === 1)
            setCredentials((Credentials) => [...Credentials, ...res]);
        });
        await getUniversities().then((res) => {
          console.log(res);
          if (University.length === 1)
            setUniversity((University) => [...University, ...res]);
        });
      }
    }
  }, []);
  return (
    <div
      style={{
        backgroundColor: "#5c2b2b",
      }}
    >
      <ToastContainer position="bottom-right" autoClose={5000} />
      <Header />
      <div className={styles.Header}>
        <div>
          <img src={logo} />
        </div>
      </div>
      <div className={styles.container}>
        {/* <div className={styles.loginText}>SUPER ADMIN DASHBOARD</div> */}
        <div className={styles.buttonWrapper}>
          <button
            className={styles.button + " " + styles.add}
            variant="contained"
            color="primary"
            style={{}}
            onClick={() => {
              history.push("/dashboard");
            }}
          >
            Go to Dashboard
          </button>
          <button
            className={styles.button + " " + styles.delete}
            variant="contained"
            color="primary"
            style={{}}
            onClick={() => {
              const cookie = new Cookies();
              cookie.remove("token-ex", {
                path: "/",
              });
              history.push("/");
            }}
          >
            Sign Out
          </button>
        </div>
        <div className={styles.loginText}>LIST OF USERS</div>
        <div className={styles.formWrapper}>
          <div>
            {Credentials &&
              Credentials.map((item, index) => {
                return (
                  <ListItem
                    key={index}
                    email={item.email}
                    passwordLength={item.passwordLength}
                    password={item.password}
                    index={index}
                    role={item.role}
                    getPasswordForUser={async (email) => {
                      const password = await getPassword(email);
                      console.log(password);
                      setCredentials((Credentials) => {
                        Credentials[index].password = password;
                        return [...Credentials];
                      });
                      console.log(Credentials);
                    }}
                  />
                );
              })}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log(e.target.user.value);
                console.log(e.target.password.value);
                console.log(e.target.role.value);
                addAdmin({
                  email: e.target.user.value,
                  password: e.target.password.value,
                  role: e.target.role.value,
                }).then((res) => {
                  if (res.status !== 400) {
                    setCredentials((Credentials) => [
                      ...Credentials,
                      {
                        email: e.target.user.value,

                        password: e.target.password.value,
                        role: e.target.role.value,
                      },
                    ]);
                    e.target.user.value = "";
                    e.target.password.value = "";
                    e.target.role.value = "READ";
                    showPassword(false);

                    toast.success("Admin added successfully");
                  } else {
                    toast.error(res.message);
                  }
                });
              }}
            >
              <div className={styles.component}>
                <div className={styles.lable}>{Credentials.length + 1}.</div>
                <input
                  required
                  name="Name"
                  className={styles.inputBox}
                  type="text"
                  id="user"
                  placeholder="Email"
                />
                <input
                  type={`${password ? "text" : "password"}`}
                  className={styles.inputBox}
                  id="password"
                  placeholder="Password"
                  required
                />
                <div className={styles.component}>
                  <select name="role" id="role">
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
                    // see password
                    showPassword(!password);
                  }}
                  className={styles.eye}
                >
                  <img src={eye} alt="eye" />
                </div>
                <button className={styles.button + " " + styles.addNew}>
                  {" "}
                  + ADD{" "}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className={styles.loginText}>LIST OF UNIVERSITY</div>
        <div className={styles.formWrapper}>
          <div>
            {University &&
              University.map((item, index) => {
                return (
                  <ListUniversity
                    key={index}
                    name={item.name}
                    index={index}
                    distance={item.distance}
                    _id={item._id}
                  />
                );
              })}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log(e.target.name.value);
                console.log(e.target.distance.value);
                setUniversity((University) => [
                  ...University,
                  {
                    name: e.target.name.value,
                    distance: e.target.distance.value,
                  },
                ]);
                const obj = {
                  name: e.target.name.value,
                  distance: e.target.distance.value,
                };
                addUniversity(obj).then((res) => {
                  if (res.status !== 400) {
                    toast.success("University added successfully");
                  } else {
                    toast.error(res.message);
                  }
                });
              }}

              // console.log(e.target.role.value);
              // // addAdmin({
              //   email: e.target.user.value,
              //   password: e.target.password.value,
              //   role: e.target.role.value,
              // }).then((res) => {
              //   if (res.status !== 400) {
              // setCredentials((Credentials) => [
              //   ...Credentials,
              //   {
              //     email: e.target.user.value,
              //     password: e.target.password.value,
              //     role: e.target.role.value,
              //   },
              // ]);
              // e.target.user.value = "";
              // e.target.password.value = "";
              // e.target.role.value = "READ";
              // showPassword(false);
              // toast.success("Admin added successfully");
              // } else {
              //   // toast.error(res.message);
              // }
              // });
              // });
            >
              <div className={styles.component}>
                <div className={styles.lable}>{University.length + 1}.</div>
                <input
                  required
                  name="Name"
                  className={styles.inputBox}
                  type="text"
                  id="name"
                  placeholder="University Name"
                />
                <input
                  type={"text"}
                  className={styles.inputBox}
                  id="distance"
                  placeholder="Distance"
                  required
                />

                <button className={styles.button + " " + styles.addNew}>
                  {" "}
                  + ADD{" "}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
