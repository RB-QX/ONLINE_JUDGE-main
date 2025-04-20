const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const { solvedate } = require("../controller/UserSolveDateController");

router.get("/solvedate/:userId", solvedate);
module.exports = router;
