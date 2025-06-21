import { Routes, RouterProvider, Route } from "react-router";
import AuthLayout from "./pages/auth/layout";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
function App() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
