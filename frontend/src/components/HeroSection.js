// frontend/src/components/HeroSection.js
import React from "react";

export default function HeroSection() {
  return (
    <section
      className="relative h-screen flex items-center justify-center text-center"
      aria-label="Welcome banner"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://picsum.photos/id/1069/2000/1000')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-6">
          Welcome to <span className="text-orange-400">DSA Hub</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          Master data structures and algorithms through interactive challenges,
          instant feedback, and community discussions.
        </p>
        <div className="space-x-4">
          <a
            href="/allproblems"
            className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-lg transition"
          >
            Browse Problems
          </a>
          <a
            href="/compiler"
            className="inline-block px-6 py-3 border border-gray-200 hover:bg-gray-200 text-gray-100 hover:text-gray-900 rounded-lg transition"
          >
            Try the Compiler
          </a>
        </div>
      </div>

      {/* Animated Scroll Cue */}
      <div className="absolute bottom-8 animate-bounce text-gray-300">
        ↓ Scroll to explore ↓
      </div>
    </section>
  );
}
