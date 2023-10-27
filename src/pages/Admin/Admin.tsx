import { useSelector } from "react-redux";
import { useEffect } from "react";
import styles from "./Admin.module.css";
import {
  addAdmin,
  addUniversity,
  getAdmins,
  getPassword,
  getUniversities,
} from "../../services/admin.service";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import eye from "../../assets/Items/eye.svg";
import { useState } from "react";
import User from "../../components/Lists/User";
import FHeader from "../../components/Header/FHeader";
import { PersonRounded, SchoolRounded } from "@mui/icons-material";
import { toastify } from "../../utils/general.helper";
import University from "../../components/Lists/University";
import Button from "../../components/Button";
import { CircularProgress } from "@mui/material";

const Admin = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "READ",
  });
  const [newUniversity, setNewUniversity] = useState({
    name: "",
    distance: "",
  });
  const [uniLoading, setUniLoading] = useState(false);
  const [password, showPassword] = useState(false);
  const [credentials, setCredentials] = useState([
    {
      email: "developer@ppsu.db",
      passwordLength: 8,
      password: "",
      role: "WRITE",
    },
  ]);
  const [university, setUniversity] = useState([
    {
      name: "P P Savani School of Engineering, Kosamba",
      distance: 0,
    },
  ]);
  useEffect(() => {
    const cookie = new Cookies();
    if (!cookie.get("token-ex")) return navigate("/");
    if (user) {
      if (!user.admin) return navigate("/dashboard");
    }
    fetchCreds();
  }, [user]);
  async function fetchCreds() {
    await getAdmins().then((res) => {
      if (credentials.length === 1)
        setCredentials(() => [
          {
            email: "developer@ppsu.db",
            passwordLength: 8,
            password: "",
            role: "WRITE",
          },
          ...res,
        ]);
    });
  }
  async function fetchUni() {
    setUniLoading(true);
    await getUniversities().then((res) => {
      console.log(res);
      if (university.length === 1)
        setUniversity((university) => [...university, ...res]);
    });
    setUniLoading(false);
  }
  return (
    <div>
      <FHeader />
      <div className={styles.container}>
        <div className={styles.title}>LIST OF USERS</div>
        <div className={styles.formWrapper}>
          <div>
            {credentials &&
              credentials.map((item, index) => {
                return (
                  <User
                    key={index}
                    email={item.email}
                    password={item.password}
                    index={index}
                    role={item.role}
                    setCredentials={(user: any) => {
                      setCredentials((Credentials) => {
                        Credentials[index] = user;
                        return [...Credentials];
                      });
                    }}
                    getPasswordForUser={async (email: string) => {
                      const password = await getPassword(email);
                      setCredentials((Credentials) => {
                        Credentials[index].password = password;
                        return [...Credentials];
                      });
                    }}
                  />
                );
              })}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addAdmin({
                  email: newUser.email,
                  password: newUser.password,
                  role: newUser.role,
                }).then((res) => {
                  if (res.status !== 400) {
                    setCredentials((Credentials: any) => [
                      ...Credentials,
                      {
                        email: newUser.email,
                        password: newUser.password,
                        role: newUser.role,
                      },
                    ]);
                    setNewUser({
                      email: "",
                      password: "",
                      role: "READ",
                    });
                    showPassword(false);
                    toastify("Admin added successfully", "success");
                  } else {
                    toastify(res.message, "error");
                  }
                });
              }}
            >
              <div className={styles.component}>
                <div className={styles.lable}>{credentials.length + 1}.</div>
                <input
                  required
                  name="Name"
                  className={styles.inputBox}
                  type="text"
                  id="user"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((newUser) => {
                      newUser.email = e.target.value;
                      return { ...newUser };
                    })
                  }
                />
                <input
                  type={`${password ? "text" : "password"}`}
                  className={styles.inputBox}
                  id="password"
                  placeholder="Password"
                  required
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser((newUser) => {
                      newUser.password = e.target.value;
                      return { ...newUser };
                    })
                  }
                />
                <div className={styles.component}>
                  <select
                    name="role"
                    id="role"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser((newUser) => {
                        newUser.role = e.target.value;
                        return { ...newUser };
                      })
                    }
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
                  className={styles.eye}
                  onClick={() => showPassword(!password)}
                >
                  <img src={eye} alt="eye" />
                </div>
                <Button
                  type="submit"
                  className={styles.button + " " + styles.addNew}
                  endIcon={<PersonRounded />}
                >
                  {" "}
                  Add{" "}
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className={styles.title}>LIST OF UNIVERSITY</div>
        <div className={styles.formWrapper}>
          <div>
            {university &&
              university.map((item: any, index) => {
                return (
                  <University
                    key={index}
                    name={item.name}
                    index={index}
                    distance={item.distance}
                    _id={item._id}
                    _setDistance={(distance: any) => {
                      setUniversity((university) => {
                        university[index].distance = distance;
                        return [...university];
                      });
                    }}
                  />
                );
              })}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const obj = {
                  name: newUniversity.name,
                  distance: newUniversity.distance,
                };
                addUniversity(obj).then((res) => {
                  if (res.status !== 400) {
                    toastify("University added successfully", "success");
                    setUniversity((university: any) => [
                      ...university,
                      {
                        name: newUniversity.name,
                        distance: newUniversity.distance,
                      },
                    ]);
                    setNewUniversity({
                      name: "",
                      distance: "",
                    });
                  } else {
                    toastify(res.message, "error");
                  }
                });
              }}

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
                <div className={styles.lable}></div>
                <input
                  required
                  name="Name"
                  className={styles.inputBox}
                  type="text"
                  id="name"
                  placeholder="University Name"
                  value={newUniversity.name}
                  onChange={(e) =>
                    setNewUniversity((newUniversity) => {
                      newUniversity.name = e.target.value;
                      return { ...newUniversity };
                    })
                  }
                />
                <input
                  type={"text"}
                  className={styles.inputBox}
                  id="distance"
                  placeholder="Distance"
                  required
                  value={newUniversity.distance}
                  onChange={(e) =>
                    setNewUniversity((newUniversity) => {
                      newUniversity.distance = e.target.value;
                      return { ...newUniversity };
                    })
                  }
                />

                <Button
                  className={styles.button + " " + styles.addNew}
                  endIcon={<SchoolRounded />}
                >
                  {" "}
                  Add{" "}
                </Button>
              </div>
            </form>
          </div>
          {university.length === 1 && (
            <Button
              variant="outlined"
              onClick={() => {
                fetchUni();
              }}
              style={{ width: "100%" }}
            >
              {uniLoading ? (
                <CircularProgress size={25} color="inherit" thickness={6} />
              ) : (
                "Load Universities"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
