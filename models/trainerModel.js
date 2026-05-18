const db = require('../config/db');

const getAllTrainers = async () => {
  const [rows] = await db.query(
    `SELECT id, trainer_name, specialization, phone, email, salary
     FROM trainers
     ORDER BY id DESC`
  );
  return rows;
};

const getTrainerById = async (id) => {
  const [rows] = await db.query(
    `SELECT id, trainer_name, specialization, phone, email, salary
     FROM trainers
     WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

const createTrainer = async (trainerData) => {
  const {
    trainer_name,
    specialization,
    phone,
    email,
    salary
  } = trainerData;

  const [result] = await db.query(
    `INSERT INTO trainers (trainer_name, specialization, phone, email, salary)
     VALUES (?, ?, ?, ?, ?)`,
    [
      trainer_name,
      specialization,
      phone,
      email || null,
      salary || 0
    ]
  );

  return result.insertId;
};

const updateTrainerById = async (id, trainerData) => {
  const {
    trainer_name,
    specialization,
    phone,
    email,
    salary
  } = trainerData;

  const [result] = await db.query(
    `UPDATE trainers
     SET trainer_name = ?,
         specialization = ?,
         phone = ?,
         email = ?,
         salary = ?
     WHERE id = ?`,
    [
      trainer_name,
      specialization,
      phone,
      email || null,
      salary || 0,
      id
    ]
  );

  return result.affectedRows;
};

const deleteTrainerById = async (id) => {
  const [result] = await db.query('DELETE FROM trainers WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = {
  getAllTrainers,
  getTrainerById,
  createTrainer,
  updateTrainerById,
  deleteTrainerById
};
