const db = require('../config/db');

const getAllPayments = async () => {
  const [rows] = await db.query(
    `SELECT p.id, p.member_id, m.full_name, p.amount, p.payment_method, p.payment_status, p.payment_date
     FROM payments p
     LEFT JOIN members m ON m.id = p.member_id
     ORDER BY p.id DESC`
  );
  return rows;
};

const getPaymentById = async (id) => {
  const [rows] = await db.query(
    `SELECT id, member_id, amount, payment_method, payment_status, payment_date
     FROM payments
     WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

const createPayment = async (paymentData) => {
  const { member_id, amount, payment_method, payment_status, payment_date } = paymentData;

  const [result] = await db.query(
    `INSERT INTO payments (member_id, amount, payment_method, payment_status, payment_date)
     VALUES (?, ?, ?, ?, ?)`,
    [
      member_id,
      amount,
      payment_method || 'cash',
      payment_status || 'pending',
      payment_date || null
    ]
  );

  return result.insertId;
};

const updatePaymentById = async (id, paymentData) => {
  const { member_id, amount, payment_method, payment_status, payment_date } = paymentData;

  const [result] = await db.query(
    `UPDATE payments
     SET member_id = ?,
         amount = ?,
         payment_method = ?,
         payment_status = ?,
         payment_date = ?
     WHERE id = ?`,
    [
      member_id,
      amount,
      payment_method || 'cash',
      payment_status || 'pending',
      payment_date || null,
      id
    ]
  );

  return result.affectedRows;
};

const deletePaymentById = async (id) => {
  const [result] = await db.query('DELETE FROM payments WHERE id = ?', [id]);
  return result.affectedRows;
};

const getMemberOptions = async () => {
  const [rows] = await db.query(
    'SELECT id, full_name FROM members ORDER BY full_name'
  );
  return rows;
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePaymentById,
  deletePaymentById,
  getMemberOptions
};
