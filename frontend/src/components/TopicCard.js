// import React from "react";

// const TopicCard = ({ title, description }) => {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105">
//       <h3 className="text-xl font-semibold mb-3">{title}</h3>
//       <p>{description}</p>
//     </div>
//   );
// };

// export default TopicCard;
import React, { useState } from "react";

const TopicCard = ({ title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="bg-yellow-200 p-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105 hover:rotate-2 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        border: "2px solid transparent",
        backgroundImage: isHovered
          ? "linear-gradient(to right, #f15f79, #b24592, #3c2e72)"
          : "none",
        backgroundClip: "padding-box",
        padding: "4px", // Adjust as needed for the border width
      }}
    >
      <div
        className="bg-white rounded-lg overflow-hidden"
        style={{
          opacity: isHovered ? 0 : 1, // Change opacity condition
          transition: "opacity 0.3s ease-in-out",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <h3 className="text-xl font-semibold mb-3 text-black relative z-10">
        {title}
      </h3>
      <p className="text-black relative z-10">{description}</p>
    </div>
  );
};

export default TopicCard;
