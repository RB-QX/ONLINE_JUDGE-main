// utils/jwt.js
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY; // Use a more secure secret in production

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    secret,
    { expiresIn: "1h" }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

module.exports = { generateToken, verifyToken };
