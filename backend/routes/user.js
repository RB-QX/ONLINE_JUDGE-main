// Import the required modules
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
// Import the required controllers and middleware functions
const {
  login,
  signup,
  forgotpassword,
  resetpassword,
  totaluser,
} = require("../controller/Auth");

// Routes for Login, Signup, and Authentication

// Route for user login
//router.post("/login", authMiddleware, login);
router.post("/login", login);
// Route for user signup
router.post("/register", signup);
router.get("/totaluser", totaluser);

// Route for sending OTP to the user's email
router.post("/forgot-password", forgotpassword);

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password/:id/:token", resetpassword);

// Export the router for use in the main application
module.exports = router;
