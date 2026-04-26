/**
 * XJ3395 — Interfaces Layer
 * What this file handles: Public verification routes that bypass auth.
 */
const express = require('express');
const router = express.Router();

module.exports = (applicationController) => {
  // Public verification endpoint
  router.get('/verify/:id', (req, res) => applicationController.verifyLicensePublic(req, res));
  
  return router;
};
