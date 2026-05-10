/**
 * XJ3395 — Domain Layer
 * What this file handles: Application number formatting domain service.
 */
class ApplicationNumberService {
  /**
   * Generates a formatted application number.
   * @param {number} year 
   * @param {number} sequence 
   * @returns {string}
   */
  generateNumber(year, sequence) {
    return `TL-${year}-${String(sequence).padStart(5, '0')}`;
  }
}
module.exports = { ApplicationNumberService };
