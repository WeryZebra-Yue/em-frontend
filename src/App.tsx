import { ToastContainer } from "react-toastify";
import Router from "./routes";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { verifyToken } from "./services/admin.service";
import { Cookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";

const App = () => {
  const cookie = new Cookies();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const auth = useSelector((state: any) => state.auth.authIn);
  useEffect(() => {
    if (user) return;
    if (cookie.get("token-ex"))
      verifyToken(cookie.get("token-ex")).then(
        (res) => res && dispatch({ type: "SET_USER", payload: res })
      );
    else dispatch({ type: "NO_USER" });
  }, [user, auth]);
  return (
    <>
      <Router />
      <ToastContainer className={"toast-container"} />
    </>
  );
};

export default App;
