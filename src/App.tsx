import { ToastContainer } from "react-toastify";
import Router from "./routes";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { verifyToken } from "./services/admin.service";
import { Cookies } from "react-cookie";
import { useDispatch } from "react-redux";

const App = () => {
  const cookie = new Cookies();
  const dispatch = useDispatch();
  useEffect(() => {
    if (cookie.get("token-ex"))
      verifyToken(cookie.get("token-ex")).then(
        (res) => res && dispatch({ type: "SET_USER", payload: res })
      );
    else dispatch({ type: "NO_USER" });
  }, []);
  return (
    <>
      <Router />
      <ToastContainer className={"toast-container"} />
    </>
  );
};

export default App;
