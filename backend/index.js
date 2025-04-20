// backend/index.js
require('dotenv').config();            // Load .env early
const express        = require('express');
const cookieParser   = require('cookie-parser');
const cors           = require('cors');
const { DBConnection } = require('./database/db.js');

// Route modules
const userRoutes               = require('./routes/UserRoute');
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
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ----- Route registration -----
app.use('/', userRoutes);
app.use('/', problemsRoutes);
app.use('/', addUserProblemRoutes);
app.use('/', contestProblemRoutes);
app.use('/', codeRoutes);
app.use('/', submissionRoutes);
app.use('/', userSolveRoute);
app.use('/', userSolveProgramRoute);

app.use('/api/recommendations', recommendationRoutes);
app.use('/stats',     require('./routes/stats'));
app.use('/activity',  require('./routes/activity'));

// Health check / root
app.get('/', (req, res) => res.send('Hello World to Online Judge'));

// ----- Server startup -----
const PORT = process.env.BACKEND_PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on port ${PORT}`);
});

// Gracefully handle port in use
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌  Port ${PORT} is already in use.` +
                  ` Make sure no other service is running on that port or set BACKEND_PORT to a different value.`);
    process.exit(1);
  } else {
    console.error(err);
  }
});

module.exports = app;
