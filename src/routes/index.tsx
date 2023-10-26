import Auth from "../pages/Auth";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Header from "../components/Header/Header";
import Loader from "../pages/Loader";
import { useEffect, useState } from "react";
import Admin from "../pages/Admin";

const Router = () => {
  const user = useSelector((state: any) => state.auth.user);
  const loading = useSelector((state: any) => state.auth.loading);
  const [delay, setDelay] = useState(true);
  useEffect(() => {
    setTimeout(() => setDelay(false), 2000);
  }, []);

  return (
    <>
      <Header />
      {loading || delay ? (
        <Routes>
          <Route path="/*" element={<Loader />} />
        </Routes>
      ) : (
        <>
          <Routes>
            <Route path="/" element={user ? <div>Dashboard</div> : <Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/*" element={<div>Not Found</div>} />
          </Routes>
        </>
      )}
    </>
  );
};

export default Router;
