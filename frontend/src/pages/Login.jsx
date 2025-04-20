import React from "react";
import Template from "../components/Template";

const Login = ({ setIsLoggedIn }) => {
  return (
    <Template
      title="Welcome Back"
      desc1="Clean code always looks like it was written by someone who cares."
      desc2="It is not the language that makes programs appear simple. It is the programmer that make the language appear simple!"
      formtype="login"
      setIsLoggedIn={setIsLoggedIn}
    />
  );
};

export default Login;
