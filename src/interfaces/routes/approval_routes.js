/**
 * XJ3395 — Interfaces Layer
 * What this file handles: Approver routes.
 */
const express = require('express');
const router = express.Router();
const { requireRole } = require('../middleware/role_middleware');

module.exports = (approvalController) => {
  router.get('/pending', requireRole('APPROVER'), (req, res) => approvalController.getPending(req, res));
  router.put('/:id/action', requireRole('APPROVER'), (req, res) => approvalController.approveAction(req, res));
  return router;
};
