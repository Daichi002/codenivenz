import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Importing eye icons from react-icons

function Register() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const jsonData = {
      data: {
        name,
        email,
        password,
        address,
        phoneNumber,
      },
    };
    const jsonString = JSON.stringify(jsonData);

    setLoading(true); // Set loading to true before making the request

    try {
      const response = await fetch(`http://localhost:1337/api/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonString,
      });
      setLoading(false); // Set loading to false after receiving the response

      if (response.ok) {
        const data = await response.json();
        alert("Registration successful!");
        window.location.reload();
      } else {
        const errorData = await response.text();
        alert("Registration failed!");
        console.error(errorData);
      }
    } catch (error) {
      setLoading(false); // Ensure loading is stopped even if an error occurs
      console.error("Error:", error);
      alert("An error occurred while registering!");
    }
  };

  return (
    <section className="p-6 bg-gray-100 text-gray-800 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md px-6 py-8 rounded-md bg-white shadow-md">
        {/* Top Section: Image */}
        <div className="flex justify-center mb-6">
          <img
            src="dali.jpg"
            alt="Register Illustration"
            className="w-32 h-32 object-cover rounded-md" // Square image with rounded corners
          />
        </div>

        {/* Title and Subtitle */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Register</h1>
        <p className="text-gray-600 mb-6 text-center">
          Create an account to get started with our platform.
        </p>

        {/* Register Form */}
        <form noValidate className="space-y-4" onSubmit={handleRegister}>
          {/* Name Field */}
          <div>
            <input
              id="name"
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-teal-500 focus:border-teal-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {/* Phone Number Field */}
          <div>
            <input
              id="phoneNumber"
              type="text"
              placeholder="Phone Number"
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-teal-500 focus:border-teal-500"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          {/* Address Field */}
          <div>
            <input
              id="address"
              type="text"
              placeholder="Address"
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-teal-500 focus:border-teal-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          {/* Email Field */}
          <div>
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-teal-500 focus:border-teal-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* Password Field */}
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-teal-500 focus:border-teal-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          {/* Confirm Password Field */}
          <div className="relative">
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-teal-500 focus:border-teal-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 font-semibold rounded-md bg-blue-800 text-white hover:bg-slate-500 flex items-center justify-center"
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
              "Sign Up"
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-rose-950 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;