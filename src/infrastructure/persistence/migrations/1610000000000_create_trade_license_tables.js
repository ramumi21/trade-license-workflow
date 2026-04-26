exports.up = (pgm) => {
  pgm.sql(`
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE trade_license_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number VARCHAR(30) UNIQUE NOT NULL,
  license_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  applicant_id VARCHAR(50) NOT NULL,
  commodity_id UUID,
  payment_amount NUMERIC(15,2),
  payment_currency VARCHAR(10),
  payment_transaction_id VARCHAR(100),
  payment_paid_at TIMESTAMP,
  payment_is_settled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP
);

CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL
    REFERENCES trade_license_applications(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  document_type VARCHAR(100),
  uploaded_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE workflow_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL
    REFERENCES trade_license_applications(id) ON DELETE CASCADE,
  author_id VARCHAR(50) NOT NULL,
  role VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE application_sequences (
  year INT PRIMARY KEY,
  last_sequence INT NOT NULL DEFAULT 0
);
  `);
};
exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE application_sequences;
    DROP TABLE workflow_comments;
    DROP TABLE attachments;
    DROP TABLE trade_license_applications;
  `);
};
