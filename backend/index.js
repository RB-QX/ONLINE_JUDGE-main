require('dotenv').config();            // Load .env early
const express        = require('express');
const cookieParser   = require('cookie-parser');
const cors           = require('cors');
const { DBConnection } = require('./database/db.js');

// Route modules
const userRoutes               = require('./routes/user');
const problemsRoutes           = require('./routes/problems');
const addUserProblemRoutes     = require('./routes/adduserproblem');
const contestProblemRoutes     = require('./routes/ContestRoute');
const codeRoutes               = require('./routes/code');
const submissionRoutes         = require('./routes/Submission');
const userSolveRoute           = require('./routes/usersolveroute');
const userSolveProgramRoute    = require('./routes/usersolveprogramroute');
const recommendationRoutes     = require('./routes/recommendation');

const app = express();

// ----- Database connection -----
DBConnection();

// ----- Start recommendation cron job -----
require('./scripts/recommenderJob');

// ----- Middleware -----
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----- CORS configuration -----
const allowedOrigins = [
  'http://localhost:3000',       // Local dev
  'https://codeinnovate.tech',   // Production domain
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ----- Route registration -----
// Authentication middleware can be inserted before protected routes if needed
app.use('/', userRoutes);
app.use('/', problemsRoutes);
app.use('/', addUserProblemRoutes);
app.use('/', contestProblemRoutes);
app.use('/', codeRoutes);
app.use('/', submissionRoutes);
app.use('/', userSolveRoute);
app.use('/', userSolveProgramRoute);

// Recommendations (requires auth – ensure userRoutes sets req.user)
app.use('/api/recommendations', recommendationRoutes);

// Health check / root
app.get('/', (req, res) => {
  res.send('Hello World to Online Judge');
});

// ----- Server startup -----
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
