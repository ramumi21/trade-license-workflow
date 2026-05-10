/**
 * XJ3395 — Infrastructure Layer
 * What this file handles: Implementation of ApplicationReadRepository using pg.
 */
const pool = require('../db');
const { IApplicationReadRepository } = require('../../../application/queries/interfaces/i_application_read_repository');

class ApplicationReadRepository extends IApplicationReadRepository {
  async getReviewerQueue() {
    const res = await pool.query(`
      SELECT 
        a.id, a.application_number, a.license_type, a.status, a.applicant_id, a.created_at,
        a.payment_is_settled
      FROM trade_license_applications a
      WHERE a.status IN ('SUBMITTED', 'ADJUSTED', 'RE_REVIEW')
      ORDER BY a.created_at ASC
    `);
    return res.rows.map(this._mapToSummaryDto);
  }

  async getApproverQueue() {
    const res = await pool.query(`
      SELECT 
        a.id, a.application_number, a.license_type, a.status, a.applicant_id, a.created_at,
        a.payment_is_settled
      FROM trade_license_applications a
      WHERE a.status = 'UNDER_REVIEW'
      ORDER BY a.created_at ASC
    `);
    return res.rows.map(this._mapToSummaryDto);
  }

  async getApplicationsByApplicantId(id) {
    const res = await pool.query(`
      SELECT 
        a.id, a.application_number, a.license_type, a.status, a.applicant_id, a.created_at,
        a.payment_is_settled
      FROM trade_license_applications a
      WHERE a.applicant_id = $1
      ORDER BY a.created_at DESC
    `, [id]);
    return res.rows.map(this._mapToSummaryDto);
  }

  async getApplicationDetail(id) {
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT * FROM trade_license_applications WHERE id = $1', [id]);
      if (res.rows.length === 0) return null;
      const row = res.rows[0];

      const attRes = await client.query('SELECT id, file_name, file_path, document_type, uploaded_at FROM attachments WHERE application_id = $1', [id]);
      const comRes = await client.query('SELECT id, author_id, role, message, created_at FROM workflow_comments WHERE application_id = $1 ORDER BY created_at ASC', [id]);

      return {
        id: row.id,
        applicationNumber: row.application_number,
        licenseType: row.license_type,
        status: row.status,
        applicantId: row.applicant_id,
        commodityId: row.commodity_id,
        payment: row.payment_amount ? {
          amount: row.payment_amount,
          currency: row.payment_currency,
          isSettled: row.payment_is_settled
        } : null,
        attachments: attRes.rows.map(a => ({
          id: a.id,
          fileName: a.file_name,
          documentType: a.document_type
        })),
        comments: comRes.rows.map(c => ({
          authorId: c.author_id,
          role: c.role,
          message: c.message,
          createdAt: c.created_at
        })),
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } finally {
      client.release();
    }
  }

  _mapToSummaryDto(row) {
    return {
      id: row.id,
      applicationNumber: row.application_number,
      licenseType: row.license_type,
      status: row.status,
      applicantId: row.applicant_id,
      paymentStatus: row.payment_is_settled ? 'PAID' : 'UNPAID',
      attachments: [], // Queries don't join attachments for queues yet
      createdAt: row.created_at
    };
  }
}

module.exports = { ApplicationReadRepository };
