const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // const token = req.header("Authorization")?.replace("Bearer ", "");
  const token = req.cookies.token;
  console.log(token);
  if (!token) {
    return res.status(401).send({ error: "Access denied, no token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send({ error: "Invalid token." });
  }
};

module.exports = authMiddleware;
