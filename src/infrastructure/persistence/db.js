/**
 * XJ3395 — Infrastructure Layer
 * What this file handles: PostgreSQL Pool connection.
 */
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// If the backend fails to connect to PostgreSQL on idle clients, ensure it doesn't crash the process
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
