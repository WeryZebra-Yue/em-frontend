import { useSelector } from "react-redux";
import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import styles from "./Home.module.css";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";
import Header from "../../Components/Header/index";
import { AuthService } from "../../Services/admin.service";
import { useHistory } from "react-router-dom";
import { Cookies } from "react-cookie";
const Home = () => {
  // const toast = useToast();
  const [Captacha, setCaptacha] = React.useState(false);
  const history = useHistory();
  useEffect(() => {
    const cookie = new Cookies();

    if (cookie.get("token-ex")) {
      history.push("/dashboard");
    }
  });
  return (
    <div
      style={{
        backgroundColor: "#5c2b2b",
      }}
    >
      <ToastContainer position="bottom-right" autoClose={5000} />
      <Header />
      <div className={styles.container}>
        <div className={styles.loginText}>ADMIN LOGIN</div>
        <div className={styles.loginWrapper}>
          <div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                if (!Captacha) {
                  toast.error("Complete the captcha", {
                    position: "bottom-right",
                    autoClose: 5000,
                  });
                  return;
                }
                const email = e.target.email.value;
                const password = e.target.password.value;
                const response = await AuthService(email, password);
                if (response.status === 200) {
                  toast.success("Login Success", {
                    autoClose: 5000,
                  });
                  const cookie = new Cookies();
                  cookie.set("token-ex", response.token, {
                    path: "/",
                    maxAge: 3600,
                  });

                  // console.log(response);
                  if (
                    email === "admin@ppsu.db" ||
                    email === "developer@ppsu.db"
                  ) {
                    history.push("/admin");
                  } else {
                    history.push("/dashboard", {
                      token: response.token,
                    });
                  }
                } else if (response.status === 400) {
                  toast.error(response.message, {
                    autoClose: 5000,
                  });
                }
              }}
            >
              <div className={styles.component}>
                <div className={styles.lable}>Email Id</div>
                <input
                  required
                  name="email"
                  type="text"
                  placeholder="Email Id"
                  className={styles.emailInput}
                />
              </div>
              <div className={styles.component}>
                <div className={styles.lable}>Password</div>
                <input
                  required
                  name="password"
                  type="password"
                  placeholder="Password"
                  className={styles.emailInput}
                />
              </div>
              {/* I am not robot */}
              <div className={styles.captcha}>
                <div>Please tick this box to continue</div>
                <ReCAPTCHA
                  sitekey="6LceztAiAAAAAJwQ2pUappnajHm1DPHegBu-dMCF"
                  onChange={(e) => {
                    setCaptacha(true);
                  }}
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
};

export default Home;
