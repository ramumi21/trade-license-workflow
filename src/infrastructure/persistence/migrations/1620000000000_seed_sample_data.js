exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO trade_license_applications (id, application_number, license_type, status, applicant_id, payment_amount, payment_currency, payment_is_settled)
    VALUES 
    (gen_random_uuid(), 'TL-2025-00001', 'TRADE_LICENSE', 'PENDING', gen_random_uuid(), 100.00, 'USD', false),
    (gen_random_uuid(), 'TL-2025-00002', 'TRADE_LICENSE', 'SUBMITTED', gen_random_uuid(), 100.00, 'USD', true),
    (gen_random_uuid(), 'TL-2025-00003', 'TRADE_LICENSE', 'UNDER_REVIEW', gen_random_uuid(), 100.00, 'USD', true),
    (gen_random_uuid(), 'TL-2025-00004', 'TRADE_LICENSE', 'ADJUSTED', gen_random_uuid(), 100.00, 'USD', true),
    (gen_random_uuid(), 'TL-2025-00005', 'TRADE_LICENSE', 'APPROVED', gen_random_uuid(), 100.00, 'USD', true),
    (gen_random_uuid(), 'TL-2025-00006', 'TRADE_LICENSE', 'REJECTED', gen_random_uuid(), 100.00, 'USD', true);
  `);
};
exports.down = (pgm) => {
  pgm.sql('DELETE FROM trade_license_applications;');
};
