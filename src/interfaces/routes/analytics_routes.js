const express = require('express');
const router = express.Router();

module.exports = (analyticsController) => {
  router.get('/dashboard', (req, res) => analyticsController.getDashboardAnalytics(req, res));
  return router;
};
