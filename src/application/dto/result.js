/**
 * XJ3395 — Application Layer
 * What this file handles: Helper to construct standardized results.
 */
class Result {
  static success(data, message) {
    return { success: true, data, message };
  }
  static failure(message, code) {
    return { success: false, message, code };
  }
}

module.exports = { Result };
