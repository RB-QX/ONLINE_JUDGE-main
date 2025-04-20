const express = require("express");
const app = express();
// const dotenv = require("dotenv");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const User = require("./model/User.js");
// const cookieparser = require("cookie-parser");
const { DBConnection } = require("./database/db.js");
const cors = require("cors");
const userRoutes = require("./routes/user");
const problemsRoutes = require("./routes/problems");
const adduserproblemRoutes = require("./routes/adduserproblem");
//const authMiddleware = require("./middlewars/auth");
const contestproblemRoutes = require("./routes/ContestRoute");
const code = require("./routes/code");
const SubmissionRoutes = require("./routes/Submission");
const usersolveroute = require("./routes/usersolveroute");
const usersolveprogramroute = require("./routes/usersolveprogramroute");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
//app.use(cors());
DBConnection();
// const allowedOrigins = [
//   "http://localhost:3000", // Local development
//   "https://online-judge-i86h.vercel.app", // Production
// ];
const allowedOrigins = [
  "http://localhost:3000", // Local development
  "https://codeinnovate.tech", // Production
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// app.use(
//   cors({
//     origin: "https://online-judge-thmb.vercel.app/", // replace with your frontend domain
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRoutes);
app.use("/", problemsRoutes);
app.use("/", adduserproblemRoutes);
app.use("/", code);

app.use("/", contestproblemRoutes);
app.use("/", SubmissionRoutes);
app.use("/", usersolveroute);
app.use("/", usersolveprogramroute);
//app.use("/adduserproblem", authMiddleware, adduserproblemRoutes);

app.get("/", (req, res) => {
  res.send("Hello World to onlinejudge");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
