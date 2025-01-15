import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("customers");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:1337/api/${role}?filters[email][$eq]=${email}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch data");
      }
      // mao ni ang magcheck kung ang email wala sa database  
      if (data.data.length === 0) {
        setLoading(false);
        setTimeout(() => {
          setEmail("");
          setPassword("");
          setShowPassword(false);
        }, 1500);
        return;
      }

      const user = data.data[0];
      if (user.password !== password) {
        setLoading(false);
        setTimeout(() => {
          setEmail("");
          setPassword("");
          setShowPassword(false);
        }, 1500);
        return;
      }

      sessionStorage.setItem("user", JSON.stringify(user));
      if (role === "admins") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 bg-gray-100 text-gray-800 min-h-screen flex justify-center items-center">
      <div className="container max-w-lg bg-white rounded-md shadow-md p-6 text-center">
        {/* Image Section */}
        <div className="mb-6">
          <img
            src="dali.jpg"
            alt="Login Illustration"
            className="w-32 h-32 mx-auto object-cover"
          />
        </div>

        {/* Login Form */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Login</h1>
        <form noValidate className="space-y-4" onSubmit={handleLogin}>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          {/* Password Field */}
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-teal-500 focus:border-teal-500"
            />
            {/* Toggle Visibility Button */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5" />
              ) : (
                <FiEye className="h-5 w-5" />
              )}
            </button>
          </div>
          {/* Role Dropdown and Submit Button */}
          <div className="flex items-center gap-4">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-800 focus:border-teal-500"
            >
              <option value="customers">Customer</option>
              <option value="admins">Admin</option>
            </select>
            <button
              type="submit"
              className="py-2 px-4 font-semibold rounded-md bg-blue-800 text-white hover:bg-slate-500 flex-grow flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
        {/* Register Link */}
        <p className="mt-6 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-rose-950 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;