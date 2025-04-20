// Import the required modules
const express = require("express");
const router = express.Router();
//const authMiddleware = require("../middlewares/auth");
const {
  addContestProblem,
  allContestProblem,
  allContestProblembyId,
} = require("../controller/ContestController");

router.post("/addcontestproblem", addContestProblem);

router.get("/allcontestproblem", allContestProblem);
router.get("/allcontestproblembyid/:id", allContestProblembyId);

module.exports = router;
