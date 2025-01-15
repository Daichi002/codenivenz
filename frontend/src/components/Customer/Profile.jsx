import React, { useState } from "react";
import Header from "./Header";

const Profile = () => {
  const initialUser = JSON.parse(sessionStorage.getItem("user"));
  // States
  const [user, setUser] = useState(initialUser); // Current user data
  const [isEditing, setIsEditing] = useState(false); // Edit mode
  const [formData, setFormData] = useState(initialUser); // Form data for editing

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Save changes
  const handleSave = () => {
    setUser(formData); // Update user data
    setIsEditing(false); // Exit edit mode
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(user); // Reset form data to current user info
    setIsEditing(false); // Exit edit mode
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-5">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
          <div className="p-6">
            {/* Profile View */}
            {!isEditing ? (
              <>
                {/* Profile Picture */}
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-500">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                </div>

                {/* User Details */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    Member since:{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <label className="w-32 text-gray-600 font-medium">
                      Email:
                    </label>
                    <span className="text-gray-800">{user.email}</span>
                  </div>
                  <div className="flex items-center">
                    <label className="w-32 text-gray-600 font-medium">
                      Phone:
                    </label>
                    <span className="text-gray-800">{user.phoneNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <label className="w-32 text-gray-600 font-medium">
                      Address:
                    </label>
                    <span className="text-gray-800">{user.address}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
              
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
