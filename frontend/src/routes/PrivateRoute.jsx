import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../component/shared/Navbar";
const PrivateRoute = () => {
  const token = useSelector((state) => state.auth.token);
 
  
  return token ? (
    <div>
      <Navbar />
     <Outlet />
    </div>
  ) : (
    <Navigate to="/auth/login" replace />
  );
};

export default PrivateRoute;
