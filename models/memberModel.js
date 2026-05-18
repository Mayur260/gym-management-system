const db = require('../config/db');

const getAllMembers = async () => {
  const [rows] = await db.query(
    `SELECT id, full_name, age, gender, phone, email, address, membership_plan_id, trainer_id, membership_status
     FROM members
     ORDER BY id DESC`
  );
  return rows;
};

const getMemberById = async (id) => {
  const [rows] = await db.query(
    `SELECT id, full_name, age, gender, phone, email, address, membership_plan_id, trainer_id, membership_status
     FROM members
     WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

const createMember = async (memberData) => {
  const {
    full_name,
    age,
    gender,
    phone,
    email,
    address,
    membership_plan_id,
    trainer_id,
    membership_status
  } = memberData;

  const [result] = await db.query(
    `INSERT INTO members
      (full_name, age, gender, phone, email, address, membership_plan_id, trainer_id, membership_status, join_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
    [
      full_name,
      age || null,
      gender || 'prefer_not_to_say',
      phone,
      email || null,
      address || null,
      membership_plan_id || null,
      trainer_id || null,
      membership_status || 'active'
    ]
  );

  return result.insertId;
};

const updateMemberById = async (id, memberData) => {
  const {
    full_name,
    age,
    gender,
    phone,
    email,
    address,
    membership_plan_id,
    trainer_id,
    membership_status
  } = memberData;

  const [result] = await db.query(
    `UPDATE members
     SET full_name = ?,
         age = ?,
         gender = ?,
         phone = ?,
         email = ?,
         address = ?,
         membership_plan_id = ?,
         trainer_id = ?,
         membership_status = ?
     WHERE id = ?`,
    [
      full_name,
      age || null,
      gender || 'prefer_not_to_say',
      phone,
      email || null,
      address || null,
      membership_plan_id || null,
      trainer_id || null,
      membership_status || 'active',
      id
    ]
  );

  return result.affectedRows;
};

const deleteMemberById = async (id) => {
  const [result] = await db.query('DELETE FROM members WHERE id = ?', [id]);
  return result.affectedRows;
};

const getMembershipPlanOptions = async () => {
  const [rows] = await db.query(
    'SELECT id, plan_name FROM membership_plans WHERE is_active = 1 ORDER BY plan_name'
  );
  return rows;
};

const getTrainerOptions = async () => {
  const [rows] = await db.query(
    "SELECT id, trainer_name FROM trainers WHERE status = 'active' ORDER BY trainer_name"
  );
  return rows;
};

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMemberById,
  deleteMemberById,
  getMembershipPlanOptions,
  getTrainerOptions
};
