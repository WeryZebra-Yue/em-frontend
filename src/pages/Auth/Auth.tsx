import { useState } from "react";
import { Cookies } from "react-cookie";

import Button from "../../components/Button";

import { dismissToastie, toastify } from "../../utils/general.helper";
import { AuthService, verifyToken } from "../../services/admin.service";

import styles from "./Auth.module.css";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AUTH_IN } from "../../redux/Auth/AuthActions";

function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookie = new Cookies();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const authenticate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    if (!error)
      toastify("Server might take some time to respond", "info", {
        autoClose: 5000,
      });
    setError(false);
    const response = await AuthService(email, password);
    dismissToastie();
    try {
      if (response.status === 200) {
        const cookie = new Cookies();
        console.log(response.token);
        cookie.set("token-ex", response.token, {
          path: "/",
          // maxAge: 3600,
        });
        dispatch({
          type: AUTH_IN,
          payload: null,
        });

        if (email === "coe@ppsu.ac.in" || email === "developer@ppsu.db")
          return (window.location.href = "/admin");
        else {
          if (cookie.get("token-ex"))
            verifyToken(cookie.get("token-ex")).then(
              (res) => res && dispatch({ type: "SET_USER", payload: res })
            );
          return (window.location.href = "/dashboard");
        }
      } else if (response.status === 400) {
        setError(true);
        toastify(response.message, "error", {
          autoClose: 1000,
        });
      }
    } catch (err) {
      console.log(err);
      setError(true);
      toastify("Something went wrong", "error", {
        autoClose: 1000,
      });
    }
    setLoading(false);
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.title}>ADMIN LOGIN</div>
        <form onSubmit={authenticate} className={styles.form}>
          <div className={styles.component}>
            <div className={styles.lable}>Unique Email</div>
            <input
              required
              placeholder="Unique Email"
              className={styles.input}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.component}>
            <div className={styles.lable}>Password</div>
            <input
              required
              type="password"
              placeholder="Password"
              className={styles.input}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div
            className={styles.forgotPassword}
            onClick={() =>
              toastify("Contact Developer or Admin to reset password", "info", {
                autoClose: 5000,
              })
            }
          >
            <div>Forgot Password?</div>
          </div>

          <Button
            type={"submit"}
            variant={"outlined"}
            className={`${styles.submit} ${
              !(email === "" || password === "") ? styles.submitActive : ""
            }`}
            disabled={email === "" || password === ""}
          >
            {loading ? (
              <CircularProgress color="inherit" size={25} thickness={6} />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Auth;

{
  /* Captcha Code */
}
{
  /* <div className={styles.captcha}>
            <div>Please tick this box to continue</div>
            <ReCAPTCHA
              sitekey="key"
              onChange={() => setCaptacha(true)}
            />
      </div> 
    */
}
