/**
 * XJ3395 — Interfaces Layer
 * What this file handles: Application routes.
 */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { requireRole } = require('../middleware/role_middleware');

// Setup multer
const upload = multer({ dest: process.env.STORAGE_BASE_PATH || 'uploads/' });

module.exports = (applicationController) => {
  router.post('/', requireRole('CUSTOMER'), (req, res) => applicationController.createApplication(req, res));
  router.post('/:id/submit', requireRole('CUSTOMER'), (req, res) => applicationController.submitApplication(req, res));
  router.get('/:id', (req, res) => applicationController.getApplicationById(req, res));
  router.get('/my/:applicantId', requireRole('CUSTOMER'), (req, res) => applicationController.getMyApplications(req, res));
  router.post('/:id/payment', requireRole('CUSTOMER'), (req, res) => applicationController.settlePayment(req, res));
  router.post('/:id/attachments', requireRole('CUSTOMER'), upload.single('file'), (req, res) => applicationController.uploadAttachment(req, res));
  router.delete('/:id/cancel', requireRole('CUSTOMER'), (req, res) => applicationController.cancelApplication(req, res));
  
  return router;
};
