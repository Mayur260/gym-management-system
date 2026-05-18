const db = require('../config/db');

const getAllAttendance = async () => {
  const [rows] = await db.query(
    `SELECT a.id, a.member_id, m.full_name, a.attendance_date, a.check_in_time, a.check_out_time, a.status
     FROM attendance a
     LEFT JOIN members m ON m.id = a.member_id
     ORDER BY a.id DESC`
  );
  return rows;
};

const getAttendanceById = async (id) => {
  const [rows] = await db.query(
    `SELECT id, member_id, attendance_date, check_in_time, check_out_time, status
     FROM attendance
     WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

const createAttendance = async (attendanceData) => {
  const { member_id, attendance_date, check_in_time, check_out_time, status } = attendanceData;

  const [result] = await db.query(
    `INSERT INTO attendance (member_id, attendance_date, check_in_time, check_out_time, status)
     VALUES (?, ?, ?, ?, ?)`,
    [
      member_id,
      attendance_date,
      check_in_time || null,
      check_out_time || null,
      status || 'present'
    ]
  );

  return result.insertId;
};

const updateAttendanceById = async (id, attendanceData) => {
  const { member_id, attendance_date, check_in_time, check_out_time, status } = attendanceData;

  const [result] = await db.query(
    `UPDATE attendance
     SET member_id = ?,
         attendance_date = ?,
         check_in_time = ?,
         check_out_time = ?,
         status = ?
     WHERE id = ?`,
    [
      member_id,
      attendance_date,
      check_in_time || null,
      check_out_time || null,
      status || 'present',
      id
    ]
  );

  return result.affectedRows;
};

const deleteAttendanceById = async (id) => {
  const [result] = await db.query('DELETE FROM attendance WHERE id = ?', [id]);
  return result.affectedRows;
};

const getMemberOptions = async () => {
  const [rows] = await db.query(
    'SELECT id, full_name FROM members ORDER BY full_name'
  );
  return rows;
};

module.exports = {
  getAllAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendanceById,
  deleteAttendanceById,
  getMemberOptions
};
