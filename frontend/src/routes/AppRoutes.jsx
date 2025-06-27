import { Routes, Route } from "react-router-dom"; // Use react-router-dom
import AuthLayout from "../pages/auth/layout";
import Login from "../pages/auth/login/login";
import Register from "../pages/auth/register/register";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home";
import AccountDetails from "../pages/AccountDetails";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/accounts/:id" element={<AccountDetails />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
