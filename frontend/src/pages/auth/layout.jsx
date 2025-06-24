import { PiggyBank, Shield, TrendingUp } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function AuthLayout() {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen  p-4 ">
      <div className="w-full max-w-md mx-auto space-y-8 ">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl">
              <PiggyBank className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">SplitSaver</h1>
          <p className="text-gray-600 mt-2">Smart savings, multiple accounts</p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="text-center">
            <div className="bg-green-100 p-2 rounded-lg inline-block mb-2">
              <PiggyBank className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-xs text-gray-600">Split Savings</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 p-2 rounded-lg inline-block mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600">Secure</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 p-2 rounded-lg inline-block mb-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600">Track Growth</p>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
