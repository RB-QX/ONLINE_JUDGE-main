import React from "react";

import Template from "../components/Template";

const Signup = ({ setIsLoggedIn }) => {
  return (
    <Template
      title="Welcome Conqueror!   Create Your Account in Just a Few Clicks"
      desc1="Begin Your Adventure with Us Today."
      desc2="Transform Ideas into Reality - Code with Confidence"
      formtype="signup"
      setIsLoggedIn={setIsLoggedIn}
    />
  );
};

export default Signup;
