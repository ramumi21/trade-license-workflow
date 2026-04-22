/**
 * XJ3395 — Application Layer
 * What this file handles: Generating application numbers.
 */
const pool = require('../../infrastructure/persistence/db');

class ApplicationNumberGenerator {
  async generate() {
    const year = new Date().getFullYear();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const res = await client.query(
        'INSERT INTO application_sequences (year, last_sequence) VALUES ($1, 1) ON CONFLICT (year) DO UPDATE SET last_sequence = application_sequences.last_sequence + 1 RETURNING last_sequence',
        [year]
      );
      
      await client.query('COMMIT');
      const sequence = res.rows[0].last_sequence;
      return `TL-${year}-${String(sequence).padStart(5, '0')}`;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = { ApplicationNumberGenerator };
