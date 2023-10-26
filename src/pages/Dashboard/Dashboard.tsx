import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FHeader from "../../components/Header/FHeader";
import { getAllExaminers } from "../../services/admin.service";
import { Cookies } from "react-cookie";
import { SET_LOADING } from "../../redux/Auth/AuthActions";

function Dashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchData() {
      dispatch({
        type: SET_LOADING,
        payload: true,
      });
      const cookie = new Cookies();
      const res = await getAllExaminers(cookie.get("token-ex"));
      localStorage.setItem("examiners", JSON.stringify(res));
      dispatch({
        type: SET_LOADING,
        payload: false,
      });
    }
    if (!localStorage.getItem("examiners")) fetchData();
    else console.log(JSON.parse(localStorage.getItem("examiners") || "{}"));
  }, []);
  return (
    <div>
      <FHeader />
    </div>
  );
}

export default Dashboard;
