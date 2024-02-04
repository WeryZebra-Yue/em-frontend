import Button from "../Button";
import { Cookies } from "react-cookie";
import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/General/Images/logo.png";
function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);

  return (
    <>
      <div
        className={styles.header}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <img onClick={() => navigate("/dashboard")} src={logo} />
        <div>
          {user ? (
            <>
              {" "}
              {/* {user.admin ? ( */}
              {user.admin && (
                <Button
                  variant="outlined"
                  className={styles.button}
                  onClick={() =>
                    navigate(
                      window.location.pathname === "/admin"
                        ? "/dashboard"
                        : "/admin"
                    )
                  }
                >
                  {window.location.pathname === "/admin"
                    ? "Dashboard"
                    : "Admin Panel"}
                </Button>
              )}
              <Button
                variant="outlined"
                className={styles.button}
                onClick={() =>
                  navigate(
                    window.location.pathname === "/assignment"
                      ? "/dashboard"
                      : "/assignment"
                  )
                }
              >
                {window.location.pathname === "/assignment"
                  ? "Dashboard"
                  : "Assignment"}
              </Button>
              {/* ) : null} */}
              <Button
                variant="outlined"
                className={styles.button}
                onClick={() => {
                  const cookie = new Cookies();
                  cookie.remove("token-ex");
                  dispatch({ type: "SIGN_OUT" });
                  navigate("/");
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
