import React from "react";

const FeatureCard = ({ title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;
