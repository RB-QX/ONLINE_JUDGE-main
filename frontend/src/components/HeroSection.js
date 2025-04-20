// HeroSection.js
import React from "react";

function HeroSection() {
  return (
    <div
      className="h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(https://picsum.photos/2000/1000)" }}
    >
      <div className="container mx-auto p-4 lg:p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to DSA Hub</h1>
        <p className="text-lg mb-8">
          Learn and practice data structures and algorithms with our interactive
          resources
        </p>
        <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default HeroSection;
