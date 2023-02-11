import { Navigate, useLocation, Outlet } from "react-router-dom";
import AuthService from "../auth_service";
const { getCurrentUser } = AuthService;
const StudentProtect = () => {
  const location = useLocation();

  return getCurrentUser()?.role === "Student" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default StudentProtect;
