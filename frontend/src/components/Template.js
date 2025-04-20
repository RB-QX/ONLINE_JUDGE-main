import React from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import logo from "../assets/logo.gif";
import { TypeAnimation } from "react-type-animation";
import bg from "../assets/bg.jpg";

const Template = ({ title, desc1, desc2, formtype, setIsLoggedIn }) => {
  // Sample code block to animate
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
    <div className="flex flex-col lg:flex-row justify-between w-11/12 max-w-[1160px] py-12 mx-auto gap-12 md:flex-row">
      <div className="w-full lg:w-5/12 max-w-[450px]">
        <h1 className=" text-yellow-500 font-semibold text-[1.875rem] leading-[2.375rem]">
          {title}
        </h1>
        <p className="text-[1.125rem] leading-[1.625rem] mt-4">
          <span className="text-richblack-100">{desc1}</span>
          <br />
          <span className="text-blue-100 italic">{desc2}</span>
        </p>

        {formtype === "signup" ? (
          <SignupForm setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <LoginForm setIsLoggedIn={setIsLoggedIn} />
        )}

        <div className="flex w-full items-center my-4 gap-x-2">
          <div className="w-full h-[1px] bg-richblack-700"></div>
          <p className="text-richblack-700 font-medium leading-[1.375rem]">
            OR
          </p>
          <div className="w-full h-[1px] bg-richblack-700"></div>
        </div>
      </div>

      {formtype === "signup" ? (
        <div
          className="h-fit flex flex-col lg:flex-row text-[15px] w-full lg:w-7/12 py-4 bg-gradient-to-r from-blue-900 via-yellow-200 to-yellow-500  "
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="text-center flex flex-row lg:flex-col w-full lg:w-[10%] text-yellow-400 font-inter font-bold ">
            {Array.from({ length: 11 }, (_, i) => (
              <p key={i}>{i + 1}</p>
            ))}
          </div>

          <div className="w-full lg:w-[90%] flex flex-col gap-2 font-bold font-mono text-yellow-400 pr-2 ">
            <TypeAnimation
              sequence={[codeblock, 2000, ""]}
              repeat={Infinity}
              cursor={true}
              style={{
                whiteSpace: "pre-line",
                display: "block",
              }}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mx-auto">
          <h1 className=" px- -10  text-3xl text-yellow-200 ">
            {" "}
            CODE INNOVATE GROW
          </h1>
          <img src={logo} alt="Logo" loading="lazy" />
        </div>
      )}
    </div>
  );
};

export default Template;
