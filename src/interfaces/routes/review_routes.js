/**
 * XJ3395 — Interfaces Layer
 * What this file handles: Reviewer routes.
 */
const express = require('express');
const router = express.Router();
const { requireRole } = require('../middleware/role_middleware');

module.exports = (reviewController) => {
  router.get('/pending', requireRole('REVIEWER'), (req, res) => reviewController.getPending(req, res));
  router.put('/:id/action', requireRole('REVIEWER'), (req, res) => reviewController.reviewAction(req, res));
  return router;
};
