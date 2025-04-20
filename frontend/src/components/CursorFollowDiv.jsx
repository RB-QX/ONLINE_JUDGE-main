import React, { useState } from "react";
import { Link } from "react-router-dom";

const CursorFollowDiv = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    const xVal = e.clientX - rect.left - rect.width / 2;
    const yVal = e.clientY - rect.top - rect.height / 2;
    e.currentTarget.style.transform = `rotateY(${xVal / 20}deg) rotateX(${
      -yVal / 20
    }deg)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <div
      className="flex items-center justify-center relative border-2 border-transparent transition-all duration-200 ease-linear overflow-hidden shadow-inner inter-var w-3/4 sm:w-2/3 md:w-1/2 lg:w-11/12
       mx-auto rounded-3xl"
      style={{
        transformStyle: "preserve-3d",
        position: "relative",
        zIndex: 0,
        borderTop: "2px solid rgb(251, 144, 20)",
        borderBottom: "none",
        borderLeft: "none",
        borderRight: "none",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d] relative px-3 pt-14 sm:px-24 sm:pt-24 lg:pr-0 w-full">
        <div className="w-full flex gap-12 sm:gap-24 lg:flex-row flex-col justify-center items-start flex-shrink-0">
          <div className="w-full flex flex-col items-start gap-14 flex-1">
            <div className="flex flex-col gap-y-3 self-stretch items-start">
              <div className="flex flex-col items-start self-stretch gap-y-2">
                <p className="text-orange-500 font-semibold text-lg">
                  Compiler
                </p>
                <p className="text-white font-semibold text-4xl">
                  Experience Coding Like Never Before !
                </p>
              </div>
              <p className="text-base text-white font-medium">
                Empower your coding journey with Quick Compiler – your ultimate
                tool for seamless, efficient, and on-the-go coding. Whether
                you're debugging, learning a new language, or building projects,
                Quick Compiler provides a robust, user-friendly platform to
                bring your ideas to life.
              </p>
            </div>
            <Link to="/compiler">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 !p-3 !rounded-btn h-auto bg-indigo-600 hover:bg-indigo-700 text-white undefined">
                <p className="flex items-center justify-center gap-x-2 text-base font-medium px-2">
                  Try Compiler
                </p>
              </button>
            </Link>
          </div>
          <div className="self-end sm:mr-[2px] sm:px-4 pt-4 rounded-xl border-[1.5px] border-[rgba(255_,255_,255_,0.22)] lg:border-b-0 relative bg-transparent h-[250px] sm:h-[450px] flex flex-row py-3 leading-[18px] sm:leading-6 w-full lg:w-[600px] lg:border-r-0 hover:bg-slate-400/10">
            <div className="absolute"></div>
            <div className="text-center flex flex-col w-[10%] select-none text-yellow-400 font-inter font-bold text-xs sm:text-lg">
              <p>1</p>
              <p>2</p>
              <p>3</p>
              <p>4</p>
              <p>5</p>
              <p>6</p>
              <p>7</p>
              <p>8</p>
              <p>9</p>
              <p>10</p>
              <p>11</p>
              <p>12</p>
            </div>
            <div className="w-[90%] flex flex-col gap-2 font-bold font-mono pr-1 text-xs sm:text-lg text-yellow-500">
              <span
                className="index-module_type__E-SaG"
                style={{ whiteSpace: "pre-line", display: "block" }}
              >
                &lt;!DOCTYPE html&gt;
                <br />
                &lt;html&gt;
                <br />
                &lt;head&gt;
                <br />
                &lt;title&gt;Example&lt;/title&gt;
                <br />
                &lt;link rel="stylesheet" href="styles.css"&gt;
                <br />
                &lt;/head&gt;
                <br />
                &lt;body&gt;
                <br />
                &lt;h1&gt;&lt;a href="/"&gt;Header&lt;/a&gt;&lt;/h1&gt;
                <br />
                &lt;nav&gt;
                <br />
                &lt;a href="one/"&gt;One&lt;/a&gt;
                <br />
                &lt;a href="two/"&gt;Two&lt;/a&gt;
                <br />
                &lt;a href="three/"&gt;Three&lt;/a&gt;
                <br />
                &lt;/nav&gt;
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute w-64 h-64 rounded-full -z-10 pointer-events-none"
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(rgba(251, 144, 20, 0.3), transparent, transparent)",
        }}
      ></div>
    </div>
  );
};

export default CursorFollowDiv;
