import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Auth from "../pages/Auth";
import Admin from "../pages/Admin";
import Loader from "../pages/Loader";
import Dashboard from "../pages/Dashboard";

import Header from "../components/Header/Header";
import { Routes, Route, Navigate } from "react-router-dom";
import View from "../pages/View";

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
            <Route
              path="/"
              element={user ? <Navigate to="/dashboard" /> : <Auth />}
            />
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/view" element={<View />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </>
      )}
    </>
  );
};

export default Router;
