// import React, { useState } from "react";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";

// const LoginForm = ({ setIsLoggedIn }) => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);

//   function changeHandler(event) {
//     setFormData((prevData) => ({
//       ...prevData,
//       [event.target.name]: event.target.value,
//     }));
//   }

//   async function submitHandler(event) {
//     event.preventDefault();

//     try {
//       const response = await fetch("http://localhost:8000/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setIsLoggedIn(true);
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("role", data.role);
//         localStorage.setItem("email", data.email);
//         localStorage.setItem("userId", data.userId);
//         toast.success("Logged In Successfully");
//         console.log("Login successful: ", data);
//         if (data.role === "admin") {
//           navigate("/dashboard"); // Assuming you're using React Router's `navigate` function
//         } else {
//           navigate("/"); // Redirect to home or another appropriate route for regular users
//         }
//       } else {
//         toast.error(data.message || "Login failed");
//       }
//     } catch (error) {
//       toast.error("An error occurred. Please try again.");
//       console.error("Login error: ", error);
//     }
//   }

//   return (
//     <form
//       onSubmit={submitHandler}
//       className="flex flex-col w-full gap-y-4 mt-6"
//     >
//       <label className="w-full">
//         <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
//           Email Address<sup className="text-pink-200">*</sup>
//         </p>
//         <input
//           required
//           type="email"
//           value={formData.email}
//           onChange={changeHandler}
//           placeholder="Enter email address"
//           name="email"
//           className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
//         />
//       </label>

//       <label className="w-full relative">
//         <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
//           Password<sup className="text-pink-200">*</sup>
//         </p>
//         <input
//           required
//           type={showPassword ? "text" : "password"}
//           value={formData.password}
//           onChange={changeHandler}
//           placeholder="Enter Password"
//           name="password"
//           className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
//         />

//         <span
//           className="absolute right-3 top-[38px] cursor-pointer"
//           onClick={() => setShowPassword((prev) => !prev)}
//         >
//           {showPassword ? (
//             <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
//           ) : (
//             <AiOutlineEye fontSize={24} fill="#AFB2BF" />
//           )}
//         </span>

//         <Link to="/forgot-password">
//           <p className="text-xs mt-1 text-blue-500 max-w-max ml-auto">
//             Forgot Password
//           </p>
//         </Link>
//       </label>

//       <button className="bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6">
//         Sign In
//       </button>
//     </form>
//   );
// };

// export default LoginForm;

import React, { useState, useContext } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "./AuthContext";

const LoginForm = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  //const baseurl = process.env.REACT_APP_BACKEND_URL;

  const [showPassword, setShowPassword] = useState(false);

  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  async function submitHandler(event) {
    event.preventDefault();

    try {
      //const response = await fetch("http://localhost:8000/login", {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("email", data.email);
        localStorage.setItem("userId", data.userId);
        toast.success("Logged In Successfully");
        console.log("Login successful: ", data);
        if (data.role === "admin") {
          navigate("/dashboard"); // Assuming you're using React Router's `navigate` function
        } else {
          navigate("/"); // Redirect to home or another appropriate route for regular users
        }
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      //console.error("Login error: ", error);
    }
  }

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col w-full gap-y-4 mt-6"
    >
      <label className="w-full">
        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
          Email Address<sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="email"
          value={formData.email}
          onChange={changeHandler}
          placeholder="Enter email address"
          name="email"
          className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
        />
      </label>

      <label className="w-full relative">
        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
          Password<sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={changeHandler}
          placeholder="Enter Password"
          name="password"
          className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
        />

        <span
          className="absolute right-3 top-[38px] cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>

        <Link to="/forgot-password">
          <p className="text-xs mt-1 text-blue-500 max-w-max ml-auto">
            Forgot Password
          </p>
        </Link>
      </label>

      <button className="bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6">
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;
