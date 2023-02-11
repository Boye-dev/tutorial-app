import { Navigate, useLocation, Outlet } from "react-router-dom";
import AuthService from "../auth_service";
const { getCurrentUser } = AuthService;
const TutorProtect = () => {
  const location = useLocation();

  return getCurrentUser()?.role === "Tutor" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default TutorProtect;
