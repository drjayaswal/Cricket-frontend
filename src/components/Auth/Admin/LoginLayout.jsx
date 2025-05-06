import { Navigate, Outlet } from "react-router-dom";

const RequireAdminAuth = () => {
  const isAdminLoggedIn = localStorage.getItem("token")

  return isAdminLoggedIn ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default RequireAdminAuth
