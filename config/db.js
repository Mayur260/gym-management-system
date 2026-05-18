// config/db.js
// ─────────────────────────────────────────────
//  MySQL database connection using mysql2/promise
//  We use a connection pool so multiple requests
//  can share connections efficiently.
// ─────────────────────────────────────────────

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool
// A pool keeps several connections open and reuses
// them — much faster than opening a new connection
// on every single request.
const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               process.env.DB_PORT     || 3306,
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'ironforge_gms',
  waitForConnections: true,   // queue requests if all connections are busy
  connectionLimit:    10,     // max 10 simultaneous connections in the pool
  queueLimit:         0,      // 0 = unlimited queue
  timezone:           '+05:30' // IST — adjust to your server timezone
});

// Test the connection when the app starts.
// This gives you an immediate, clear error if your
// DB credentials are wrong rather than a confusing
// failure on the first real query.
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅  MySQL connected — database:', process.env.DB_NAME);
    connection.release(); // always release back to the pool
  } catch (err) {
    console.error('❌  MySQL connection failed:', err.message);
    console.error('    Check your .env DB_* values and make sure MySQL is running.');
    process.exit(1); // stop the app — no point running without a DB
  }
}

testConnection();

module.exports = pool;
