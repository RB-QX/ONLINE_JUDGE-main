// import React, { useContext, useState } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { AuthContext } from "./AuthContext";
// import { FiMenu, FiX } from "react-icons/fi";
// import logo from "../assets/logo.gif";

// const Navbar = () => {
//   const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
//   const userRole = localStorage.getItem("role");
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.clear();
//     setIsLoggedIn(false);
//     toast.success("Logged Out");
//     setMenuOpen(false); // Close menu after logout
//   };

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   const closeMenu = () => {
//     setMenuOpen(false);
//   };

//   return (
//     <div className="relative z-10">
//       <div className="flex justify-between items-center w-11/12 max-w-[1160px] py-4 mx-auto">
//         <Link to="/">
//           <div className="flex flex-row justify-center items-center">
//             <img
//               src={logo}
//               alt="Logo"
//               width={80}
//               height={15}
//               loading="lazy"
//               className="z-10"
//             />
//             <h1 className="px-4 text-xl text-yellow-200">CODE INNOVATE GROW</h1>
//           </div>
//         </Link>

//         <div className="md:hidden">
//           <button onClick={toggleMenu} className="text-richblack-100 z-10">
//             {menuOpen ? (
//               <FiX size={24} className="text-yellow-400" />
//             ) : (
//               <FiMenu size={24} className="text-yellow-400" />
//             )}
//           </button>
//         </div>

//         <nav
//           className={`fixed top-0 right-0 h-full w-64 bg-richblack-800 text-richblack-100 transform ${
//             menuOpen ? "translate-x-0" : "translate-x-full"
//           } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:items-center w-full md:w-auto z-20`}
//         >
//           <ul className="flex flex-col md:flex-row gap-x-6 gap-y-4 mt-4 md:mt-0 p-4">
//             <li>
//               <Link to="/" onClick={closeMenu}>
//                 Home
//               </Link>
//             </li>
//             {isLoggedIn && (
//               <li>
//                 <Link to="/contest" onClick={closeMenu}>
//                   Contest
//                 </Link>
//               </li>
//             )}
//             <li>
//               <Link to="/compiler" onClick={closeMenu}>
//                 Compiler
//               </Link>
//             </li>
//             {isLoggedIn && userRole === "admin" && (
//               <>
//                 <li>
//                   <Link to="/addproblems" onClick={closeMenu}>
//                     Add Problems
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/deleteproblems" onClick={closeMenu}>
//                     Update and Delete
//                   </Link>
//                 </li>
//               </>
//             )}
//             {isLoggedIn && userRole === "user" && (
//               <li>
//                 <Link to="/adduserproblems" onClick={closeMenu}>
//                   Add Problems
//                 </Link>
//               </li>
//             )}
//             <li>
//               <Link to="/allproblems" onClick={closeMenu}>
//                 Problems
//               </Link>
//             </li>
//           </ul>

//           {isLoggedIn && (
//             <div className="flex flex-col md:flex-row md:items-center gap-y-4 mt-4 md:mt-0 md:gap-x-4 p-4">
//               <button
//                 onClick={() => {
//                   handleLogout();
//                   closeMenu();
//                 }}
//                 className="bg-richblack-800 text-richblack-100 py-[8px] px-[12px] rounded-[8px] border border-richblack-700"
//               >
//                 Log Out
//               </button>
//               {userRole === "admin" && (
//                 <Link to="/dashboard" onClick={closeMenu}>
//                   <button className="bg-richblack-800 text-richblack-100 py-[8px] px-[12px] rounded-[8px] border border-richblack-700">
//                     Dashboard
//                   </button>
//                 </Link>
//               )}
//               {userRole === "user" && (
//                 <Link to="/profile" onClick={closeMenu}>
//                   <button className="bg-richblack-800 text-richblack-100 py-[8px] px-[12px] rounded-[8px] border border-richblack-700">
//                     Profile
//                   </button>
//                 </Link>
//               )}
//             </div>
//           )}
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

// import React, { useContext } from "react";
// import logo from "../assets/logo.gif";
// import { Link } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { AuthContext } from "./AuthContext";

// const Navbar = () => {
//   const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
//   const userRole = localStorage.getItem("role");

//   const handleLogout = () => {
//     localStorage.clear();
//     setIsLoggedIn(false);
//     toast.success("Logged Out");
//   };

//   return (
//     <div className="flex justify-between items-center w-11/12 max-w-[1160px] py-4 mx-auto">
//       <Link to="/">
//         <div className="flex flex-row justify-center items-center">
//           <img src={logo} alt="Logo" width={80} height={15} loading="lazy" />
//           <h1 className="px-10 text-xl text-yellow-200">CODE INNOVATE GROW</h1>
//         </div>
//       </Link>

//       <nav>
//         <ul className="text-richblack-100 flex gap-x-6">
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//           {isLoggedIn && (
//             <li>
//               <Link to="/contest">Contest</Link>
//             </li>
//           )}
//           <li>
//             <Link to="/compiler">Compiler</Link>
//           </li>
//           {isLoggedIn && userRole === "admin" && (
//             <>
//               <li>
//                 <Link to="/addproblems">Add Problems</Link>
//               </li>
//               <li>
//                 <Link to="/deleteproblems">Update and Delete</Link>
//               </li>
//             </>
//           )}
//           {isLoggedIn && userRole === "user" && (
//             <li>
//               <Link to="/adduserproblems">Add Problems</Link>
//             </li>
//           )}
//           <li>
//             <Link to="/allproblems">Problems</Link>
//           </li>
//         </ul>
//       </nav>

//       <div className="flex items-center gap-x-4">
//         {!isLoggedIn ? (
//           <>
//             <Link to="/login">
//               <button
//                 className="bg-richblack-800 text-richblack-100 py-[8px]
//                       px-[12px] rounded-[8px] border border-richblack-700"
//               >
//                 Log in
//               </button>
//             </Link>
//             <Link to="/register">
//               <button
//                 className="bg-richblack-800 text-richblack-100 py-[8px]
//                       px-[12px] rounded-[8px] border border-richblack-700"
//               >
//                 Sign up
//               </button>
//             </Link>
//           </>
//         ) : (
//           <>
//             <Link to="/">
//               <button
//                 onClick={handleLogout}
//                 className="bg-richblack-800 text-richblack-100 py-[8px]
//                       px-[12px] rounded-[8px] border border-richblack-700"
//               >
//                 Log Out
//               </button>
//             </Link>
//             {userRole === "admin" && (
//               <Link to="/dashboard">
//                 <button
//                   className="bg-richblack-800 text-richblack-100 py-[8px]
//                         px-[12px] rounded-[8px] border border-richblack-700"
//                 >
//                   Dashboard
//                 </button>
//               </Link>
//             )}
//             {userRole === "user" && (
//               <Link to="/profile">
//                 <button
//                   className="bg-richblack-800 text-richblack-100 py-[8px]
//                         px-[12px] rounded-[8px] border border-richblack-700"
//                 >
//                   Profile
//                 </button>
//               </Link>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;

import React, { useContext, useState } from "react";
import logo from "../assets/logo.gif";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "./AuthContext";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const userRole = localStorage.getItem("role");
  const [menuOpen, setMenuOpen] = useState(false);
  const typingAnimation = {
    display: "inline-block",
  };

  const spanStyles = {
    opacity: 1,
    animation: "typing 1s forwards",
    color: "#f15f79",
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    toast.success("Logged Out");
    setMenuOpen(false); // Close menu after logout
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="flex justify-between items-center w-11/12 max-w-[1160px] py-4 mx-auto">
      <Link to="/">
        <div className="flex flex-row justify-center items-center">
          <img src={logo} alt="Logo" width={80} height={15} loading="lazy" />
          <h1 className="px-10 text-xl text-yellow-200">CODE INNOVATE GROW</h1>
        </div>
      </Link>

      {/* Hamburger Icon for Small Screens */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-richblack-100">
          {menuOpen ? (
            <FiX size={24} className="text-yellow-400" />
          ) : (
            <FiMenu size={24} className="text-yellow-400" />
          )}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav
        className={`fixed top-0 right-0 h-full w-64 bg-richblack-800 text-richblack-100 transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:items-center w-full md:w-auto z-20`}
      >
        <ul className="flex flex-col md:flex-row gap-x-6 gap-y-4 mt-4 md:mt-0 p-4">
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          {isLoggedIn && (
            <li>
              <Link to="/contest" onClick={() => setMenuOpen(false)}>
                Contest
              </Link>
            </li>
          )}
          <li>
            <Link to="/compiler" onClick={() => setMenuOpen(false)}>
              Compiler
            </Link>
          </li>
          {isLoggedIn && userRole === "admin" && (
            <>
              <li>
                <Link to="/addproblems" onClick={() => setMenuOpen(false)}>
                  Add Problems
                </Link>
              </li>
              <li>
                <Link to="/deleteproblems" onClick={() => setMenuOpen(false)}>
                  Update and Delete
                </Link>
              </li>
            </>
          )}
          {isLoggedIn && userRole === "user" && (
            <li>
              <Link to="/adduserproblems" onClick={() => setMenuOpen(false)}>
                Add Problems
              </Link>
            </li>
          )}
          <li>
            <Link to="/allproblems" onClick={() => setMenuOpen(false)}>
              Problems
            </Link>
          </li>
        </ul>
        <div className=" md:hidden flex flex-col  gap-x-4">
          {!isLoggedIn ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <button
                  className="bg-richblack-800 text-richblack-100 py-[8px]
                      px-[12px] rounded-[8px] border border-richblack-700"
                >
                  Log in
                </button>
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <button
                  className="bg-richblack-800 text-richblack-100 py-[8px]
                      px-[12px] rounded-[8px] border border-richblack-700"
                >
                  Sign up
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                <button
                  onClick={handleLogout}
                  className="bg-richblack-800 text-richblack-100 py-[8px]
                      px-[12px] rounded-[8px] border border-richblack-700"
                >
                  Log Out
                </button>
              </Link>
              {userRole === "admin" && (
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                  <button
                    className="bg-richblack-800 text-richblack-100 py-[8px]
                        px-[12px] rounded-[8px] border border-richblack-700"
                  >
                    Dashboard
                  </button>
                </Link>
              )}
              {userRole === "user" && (
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  <button
                    className="bg-richblack-800 text-richblack-100 py-[8px]
                        px-[12px] rounded-[8px] border border-richblack-700"
                  >
                    Profile
                  </button>
                </Link>
              )}
            </>
          )}
        </div>
        <li className="md:hidden gap-x-4">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Back
          </Link>
        </li>

        {/* Logged-in User Actions */}
        {/* <div className="hidden md:flex items-center gap-x-4">
          {!isLoggedIn ? (
            <>
              <Link to="/login">
                <button
                  className="bg-richblack-800 text-richblack-100 py-[8px]
                      px-[12px] rounded-[8px] border border-richblack-700"
                >
                  Log in
                </button>
              </Link>
              <Link to="/register">
                <button
                  className="bg-richblack-800 text-richblack-100 py-[8px]
                      px-[12px] rounded-[8px] border border-richblack-700"
                >
                  Sign up
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/">
                <button
                  onClick={handleLogout}
                  className="bg-richblack-800 text-richblack-100 py-[8px]
                      px-[12px] rounded-[8px] border border-richblack-700"
                >
                  Log Out
                </button>
              </Link>
              {userRole === "admin" && (
                <Link to="/dashboard">
                  <button
                    className="bg-richblack-800 text-richblack-100 py-[8px]
                        px-[12px] rounded-[8px] border border-richblack-700"
                  >
                    Dashboard
                  </button>
                </Link>
              )}
              {userRole === "user" && (
                <Link to="/profile">
                  <button
                    className="bg-richblack-800 text-richblack-100 py-[8px]
                        px-[12px] rounded-[8px] border border-richblack-700"
                  >
                    Profile
                  </button>
                </Link>
              )}
            </>
          )}
        </div> */}
      </nav>

      {/* Login and Sign Up Buttons in Desktop View */}
      <div className="hidden md:flex items-center gap-x-4">
        {!isLoggedIn ? (
          <>
            <Link to="/login">
              <button
                className="bg-richblack-800 text-richblack-100 py-[8px]
                      px-[12px] rounded-[8px] border border-richblack-700"
              >
                Log in
              </button>
            </Link>
            <Link to="/register">
              <button
                className="bg-richblack-800 text-richblack-100 py-[8px]
                      px-[12px] rounded-[8px] border border-richblack-700"
              >
                Sign up
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/">
              <button
                onClick={handleLogout}
                className="bg-richblack-800 text-richblack-100 py-[8px]
                      px-[12px] rounded-[8px] border border-richblack-700"
              >
                Log Out
              </button>
            </Link>
            {userRole === "admin" && (
              <Link to="/dashboard">
                <button
                  className="bg-richblack-800 text-richblack-100 py-[8px]
                        px-[12px] rounded-[8px] border border-richblack-700"
                >
                  Dashboard
                </button>
              </Link>
            )}
            {userRole === "user" && (
              <Link to="/profile">
                <button
                  className="bg-richblack-800 text-richblack-100 py-[8px]
                        px-[12px] rounded-[8px] border border-richblack-700"
                >
                  Profile
                </button>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
