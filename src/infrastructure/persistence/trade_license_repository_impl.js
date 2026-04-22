/**
 * XJ3395 — Infrastructure Layer
 * What this file handles: Implementation of TradeLicenseApplicationRepository using pg.
 */
const pool = require('./db');
const { TradeLicenseApplicationRepository } = require('../../domain/repository/trade_license_application_repository');
const { TradeLicenseApplication } = require('../../domain/model/trade_license_application');
const { Attachment } = require('../../domain/model/attachment');
const { WorkflowComment } = require('../../domain/model/workflow_comment');
const { Payment } = require('../../domain/model/payment');

class TradeLicenseRepositoryImpl extends TradeLicenseApplicationRepository {
  async findById(id) {
    const res = await pool.query('SELECT * FROM trade_license_applications WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return await this._buildDomainModel(res.rows[0]);
  }

  async findByApplicantId(applicantId) {
    const res = await pool.query('SELECT * FROM trade_license_applications WHERE applicant_id = $1 ORDER BY created_at DESC', [applicantId]);
    return Promise.all(res.rows.map(row => this._buildDomainModel(row)));
  }

  async findForReviewerQueue() {
    const res = await pool.query(
      "SELECT * FROM trade_license_applications WHERE status IN ('SUBMITTED', 'ADJUSTED', 'RE_REVIEW') ORDER BY created_at ASC"
    );
    return Promise.all(res.rows.map(row => this._buildDomainModel(row)));
  }

  async findForApproverQueue() {
    const res = await pool.query(
      "SELECT * FROM trade_license_applications WHERE status = 'UNDER_REVIEW' ORDER BY created_at ASC"
    );
    return Promise.all(res.rows.map(row => this._buildDomainModel(row)));
  }

  async save(application) {
    return this.update(application); // using upsert
  }

  async update(application) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const upsertAppQuery = `
        INSERT INTO trade_license_applications 
          (id, application_number, license_type, status, applicant_id, commodity_id, 
           payment_amount, payment_currency, payment_transaction_id, payment_paid_at, payment_is_settled, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, now())
        ON CONFLICT (id) DO UPDATE SET 
          status = $4, commodity_id = $6, 
          payment_amount = $7, payment_currency = $8, payment_transaction_id = $9, payment_paid_at = $10, payment_is_settled = $11, updated_at = now()
      `;
      await client.query(upsertAppQuery, [
        application.id, application.applicationNumber, application.licenseType, application.status,
        application.applicantId, application.commodityId, 
        application.payment?.amount, application.payment?.currency, application.payment?.transactionId, application.payment?.paidAt, application.payment?.isSettled || false
      ]);

      for (const att of application.attachments) {
        if (!att.id) {
          const res = await client.query(
            'INSERT INTO attachments (application_id, file_name, file_path, document_type) VALUES ($1, $2, $3, $4) RETURNING id',
            [application.id, att.fileName, att.filePath, att.documentType]
          );
          att.id = res.rows[0].id;
        }
      }

      for (const comment of application.comments) {
        if (!comment.id) {
          const res = await client.query(
            'INSERT INTO workflow_comments (application_id, author_id, role, message) VALUES ($1, $2, $3, $4) RETURNING id',
            [application.id, comment.authorId, comment.role, comment.message]
          );
          comment.id = res.rows[0].id;
        }
      }

      await client.query('COMMIT');
      return application;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async _buildDomainModel(row) {
    const client = await pool.connect();
    try {
      const attRes = await client.query('SELECT * FROM attachments WHERE application_id = $1', [row.id]);
      const attachments = attRes.rows.map(r => new Attachment(r.id, r.file_name, r.file_path, r.document_type, r.uploaded_at));

      const comRes = await client.query('SELECT * FROM workflow_comments WHERE application_id = $1 ORDER BY created_at ASC', [row.id]);
      const comments = comRes.rows.map(r => new WorkflowComment(r.id, r.author_id, r.role, r.message, r.created_at));

      let payment = null;
      if (row.payment_amount) {
        payment = new Payment(row.payment_amount, row.payment_currency, row.payment_transaction_id, row.payment_paid_at, row.payment_is_settled);
      }

      return new TradeLicenseApplication({
        id: row.id,
        applicationNumber: row.application_number,
        licenseType: row.license_type,
        status: row.status,
        applicantId: row.applicant_id,
        commodityId: row.commodity_id,
        payment,
        attachments,
        comments,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    } finally {
      client.release();
    }
  }
}

module.exports = { TradeLicenseRepositoryImpl };
