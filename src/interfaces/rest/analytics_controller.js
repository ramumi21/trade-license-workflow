class AnalyticsController {
  constructor(analyticsRepository) {
    this.analyticsRepository = analyticsRepository;
  }

  async getDashboardAnalytics(req, res) {
    const role = req.user.role;
    let data = {};

    if (role === 'APPROVER') {
      data = await this.analyticsRepository.getApproverStats();
    } else if (role === 'REVIEWER') {
      data = await this.analyticsRepository.getReviewerStats();
    } else {
      // CUSTOMER or fallback
      data = await this.analyticsRepository.getCustomerStats(req.user.userId);
    }

    res.json({ success: true, data, timestamp: new Date() });
  }
}

module.exports = { AnalyticsController };
