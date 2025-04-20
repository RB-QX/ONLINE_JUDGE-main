// src/components/Template.jsx
import React from "react";
import { motion } from "framer-motion";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import logo from "../assets/logo.gif";
import bg from "../assets/bg.jpg";
import { TypeAnimation } from "react-type-animation";
import DarkModeToggle from "./DarkModeToggle";

const Template = ({ title, desc1, desc2, formtype, setIsLoggedIn }) => {
  const codeblock = `
<!DOCTYPE html>
<html>
<head>
  <title>ONLINE JUDGE</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>WELCOME TO CODE INNOVATE AND GROW!</h1>
</body>
</html>
`;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center p-6">
        <img src={logo} alt="Logo" className="h-10" />
        <DarkModeToggle />
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-12 px-6 py-8">
        {/* Left Panel */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 space-y-6"
        >
          <h1 className="text-4xl font-extrabold text-yellow-400">
            {title}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <span>{desc1}</span>
            <br />
            <span className="italic text-blue-600 dark:text-blue-300">
              {desc2}
            </span>
          </p>

          {/* Glass Card */}
          <div className="bg-white/30 backdrop-blur-md dark:bg-black/40 p-6 rounded-xl shadow-lg">
            {formtype === "signup" ? (
              <SignupForm setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <LoginForm setIsLoggedIn={setIsLoggedIn} />
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center text-gray-500">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-4">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex-1 relative rounded-xl overflow-hidden shadow-2xl"
        >
          {formtype === "signup" ? (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${bg})` }}
            >
              {/* Card numbers (3D depth) */}
              <div className="absolute top-4 left-4 text-yellow-300 font-mono space-y-1 text-sm">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="opacity-50">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Code animation */}
              <div className="absolute inset-0 p-6 overflow-auto">
                <TypeAnimation
                  sequence={[codeblock, 2000, ""]}
                  repeat={Infinity}
                  cursor
                  omitDeletionAnimation
                  className="whitespace-pre-line font-mono text-yellow-100 drop-shadow-lg"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
              <h2 className="text-3xl font-bold text-yellow-300 mb-4">
                CODE INNOVATE GROW
              </h2>
              <motion.img
                src={logo}
                alt="Logo"
                className="h-16"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Template;
