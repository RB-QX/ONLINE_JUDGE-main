import React, { useEffect, useState } from "react";
import CalenderPage from "./CalenderPage";
const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user information from localStorage or wherever it's stored
    const storedUser = {
      email: localStorage.getItem("email"),
    };

    setUser(storedUser);
  }, []);

  if (!user) {
    return <p>Loading...</p>; // Handle loading state if necessary
  }

  return (
    <div className="mx-auto  p-6 bg-richblack-900 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        User Profile
      </h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-yellow-400">
          Email
        </label>
        <p className="mt-1 block w-60 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
          {user.email}
        </p>
      </div>
      <div className="flex justify-center items-center rounded-full w-35 h-35 bg-blue-500 text-white text-xl font-bold">
        <p>Problem Solving Calendar</p>
      </div>
      <CalenderPage />
    </div>
  );
};

export default ProfilePage;
