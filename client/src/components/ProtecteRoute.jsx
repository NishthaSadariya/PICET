import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // Assuming role is stored in user object
  const role = user?.role;

  if (!token) return <Navigate to="/login" />; // Redirect if not logged in
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />; // Redirect if not authorized

  return <Outlet />;
};

export default ProtectedRoute;
