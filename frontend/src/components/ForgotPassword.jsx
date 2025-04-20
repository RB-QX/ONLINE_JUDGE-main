// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     fetch("http://localhost:8000/forgot-password", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email }),
//     })
//       .then((res) => {
//         setLoading(false);
//         if (!res.ok) {
//           throw new Error("Failed to send email");
//         }
//         return res.json();
//       })
//       .then((data) => {
//         if (data.Status === "Success") {
//           console.log("Email sent successfully");
//           navigate("/login");
//         } else {
//           throw new Error("Failed to send email");
//         }
//       })
//       .catch((err) => {
//         setLoading(false);
//         setError("Failed to send email. Please try again later.");
//         console.error("Error in forgot password:", err);
//       });
//   };

//   return (
//     <div className="flex items-center justify-center bg-gray-200 min-h-screen">
//       <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
//         <h4 className="text-xl font-semibold mb-4">Forgot Password</h4>
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-gray-700 mb-2">
//               <strong>Email</strong>
//             </label>
//             <input
//               type="email"
//               placeholder="Enter Email"
//               autoComplete="off"
//               name="email"
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               onChange={(e) => setEmail(e.target.value)}
//               value={email}
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className={`w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200 ${
//               loading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             disabled={loading}
//           >
//             {loading ? "Sending..." : "Send"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default ForgotPassword;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      setLoading(false);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send email");
      }

      const data = await response.json();
      console.log(data);
      if (data.status === "Success") {
        console.log("Email sent successfully");
        navigate("/login");
      } else {
        throw new Error(data.message || "Failed to send email");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to send email. Please try again later.");
      //console.error("Error in forgot password:", err);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-200 min-h-screen">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h4 className="text-xl font-semibold mb-4">Forgot Password</h4>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
