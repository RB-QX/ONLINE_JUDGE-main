// backend/server.js
require('dotenv').config();
const app = require('./index');

const PORT = process.env.BACKEND_PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend listening on port ${PORT}`);
});
server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} in use. Please free it or set BACKEND_PORT to another port.`);
    process.exit(1);
  }
  throw err;
});
