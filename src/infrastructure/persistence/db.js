/**
 * XJ3395 — Infrastructure Layer
 * What this file handles: PostgreSQL Pool connection.
 */
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;
