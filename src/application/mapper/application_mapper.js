/**
 * XJ3395 — Application Layer
 * What this file handles: Mapper for application DTOs.
 */
function toApplicationSummaryDto(app) {
  return {
    id: app.id,
    applicationNumber: app.applicationNumber,
    licenseType: app.licenseType,
    status: app.status,
    applicantId: app.applicantId,
    paymentStatus: app.payment?.isSettled ? 'PAID' : 'UNPAID',
    attachments: app.attachments ? app.attachments.map(a => ({
      id: a.id,
      fileName: a.fileName,
      documentType: a.documentType
    })) : [],
    createdAt: app.createdAt
  };
}

function toApplicationDetailDto(app) {
  return {
    id: app.id,
    applicationNumber: app.applicationNumber,
    licenseType: app.licenseType,
    status: app.status,
    applicantId: app.applicantId,
    commodityId: app.commodityId,
    payment: app.payment ? {
      amount: app.payment.amount,
      currency: app.payment.currency,
      isSettled: app.payment.isSettled
    } : null,
    attachments: app.attachments.map(a => ({
      id: a.id,
      fileName: a.fileName,
      documentType: a.documentType
    })),
    comments: app.comments.map(c => ({
      authorId: c.authorId,
      role: c.role,
      message: c.message,
      createdAt: c.createdAt
    })),
    createdAt: app.createdAt,
    updatedAt: app.updatedAt
  };
}

module.exports = { toApplicationSummaryDto, toApplicationDetailDto };
