import React from "react";
import { Link } from "react-router-dom";

const Footer = ({ footerLinks }) => {
  return (
    <footer className="bg-gray-200 text-gray-600 py-4">
      <div className="container mx-auto px-4 text-center">
        <p>
          &copy; 2024 DSA Problem Solver. All rights reserved. Made By Ritu Raj
          Prasad
        </p>
        <div className="mt-2">
          {footerLinks.map((link, index) => (
            <React.Fragment key={index}>
              <Link
                to={link.url}
                className="text-blue-500 hover:text-blue-600 px-2"
              >
                {link.text}
              </Link>
              {index !== footerLinks.length - 1 && (
                <span className="text-gray-400">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
