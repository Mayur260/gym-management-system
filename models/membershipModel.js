const db = require('../config/db');

const getAllMemberships = async () => {
  const [rows] = await db.query(
    `SELECT id, plan_name, duration_months, price, features
     FROM membership_plans
     ORDER BY id DESC`
  );
  return rows;
};

const getMembershipById = async (id) => {
  const [rows] = await db.query(
    `SELECT id, plan_name, duration_months, price, features
     FROM membership_plans
     WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

const createMembership = async (membershipData) => {
  const { plan_name, duration_months, price, features } = membershipData;

  const [result] = await db.query(
    `INSERT INTO membership_plans (plan_name, duration_months, price, features)
     VALUES (?, ?, ?, ?)`,
    [plan_name, duration_months, price, features || null]
  );

  return result.insertId;
};

const updateMembershipById = async (id, membershipData) => {
  const { plan_name, duration_months, price, features } = membershipData;

  const [result] = await db.query(
    `UPDATE membership_plans
     SET plan_name = ?,
         duration_months = ?,
         price = ?,
         features = ?
     WHERE id = ?`,
    [plan_name, duration_months, price, features || null, id]
  );

  return result.affectedRows;
};

const deleteMembershipById = async (id) => {
  const [result] = await db.query(
    'DELETE FROM membership_plans WHERE id = ?',
    [id]
  );
  return result.affectedRows;
};

module.exports = {
  getAllMemberships,
  getMembershipById,
  createMembership,
  updateMembershipById,
  deleteMembershipById
};
