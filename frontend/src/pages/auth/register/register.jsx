import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../features/auth/authActions";

function Register() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) return;

    dispatch(registerUser(form));
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <div className="backdrop-blur-sm bg-white/90 shadow-xl rounded-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8">
          <div>
            <h3 className="text-3xl font-bold text-gray-800">Create Account</h3>
            <p className="text-sm text-slate-500 mt-1">
              Start managing your savings today.
            </p>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          {error && (
            <p className="text-red-600 text-sm text-center font-medium">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Register;
