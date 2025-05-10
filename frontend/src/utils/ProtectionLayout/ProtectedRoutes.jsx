import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";

const ProtectedRoutes = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  if (!token) {
    return <Navigate to={"/login"} state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;
