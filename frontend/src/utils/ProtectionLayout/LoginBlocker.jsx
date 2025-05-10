import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";

const LoginBlocker = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  if (token) {
    return <Navigate to={"/"} state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default LoginBlocker;
