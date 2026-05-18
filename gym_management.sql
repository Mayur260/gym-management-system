-- ============================================================
--  IronForge Gym Management System
--  Database: gym_management
--  Generated for: Node.js + Express + MySQL2 backend
--
--  Import command:
--    mysql -u root -p < gym_management.sql
--
--  Or open in MySQL Workbench:
--    File → Open SQL Script → Run (⚡)
--
--  Admin login credentials:
--    Email   : admin@ironforge.com
--    Password: admin123
-- ============================================================

-- ── Safety: use utf8mb4 for full Unicode (emoji, Indian scripts) ──
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET time_zone = '+05:30';

-- ── Disable FK checks during setup to avoid order-of-creation issues ──
SET FOREIGN_KEY_CHECKS = 0;


-- ============================================================
--  1. DATABASE
-- ============================================================

DROP DATABASE IF EXISTS gym_management;
CREATE DATABASE gym_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gym_management;


-- ============================================================
--  2. TABLES
-- ============================================================

-- ── 2.1  admins ──────────────────────────────────────────────
--  Stores system admins / staff who can log into the dashboard.
--  role can be 'super_admin' or 'staff'.
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS admins;
CREATE TABLE admins (
  id          INT           NOT NULL AUTO_INCREMENT,
  full_name   VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,            -- bcrypt hash, never plain text
  role        ENUM('super_admin', 'staff')
              NOT NULL DEFAULT 'staff',
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_admins_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ── 2.2  trainers ────────────────────────────────────────────
--  Gym trainers. Members can be assigned a trainer (optional).
--  Defined BEFORE members because members.trainer_id references it.
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS trainers;
CREATE TABLE trainers (
  id               INT           NOT NULL AUTO_INCREMENT,
  trainer_name     VARCHAR(100)  NOT NULL,
  specialization   VARCHAR(150)  NOT NULL,
  phone            VARCHAR(15)   NOT NULL,
  email            VARCHAR(150)      NULL UNIQUE,
  experience_years TINYINT UNSIGNED  NULL DEFAULT 0,
  salary           DECIMAL(10,2)     NULL DEFAULT 0.00,
  status           ENUM('active', 'on_leave', 'inactive')
                   NOT NULL DEFAULT 'active',
  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_trainers_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ── 2.3  membership_plans ────────────────────────────────────
--  The pricing tiers: Monthly, Quarterly, Annual.
--  features is stored as JSON so you can add/remove features
--  without altering the schema.
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS membership_plans;
CREATE TABLE membership_plans (
  id               INT            NOT NULL AUTO_INCREMENT,
  plan_name        VARCHAR(100)   NOT NULL,
  duration_months  TINYINT        NOT NULL,           -- 1, 3, or 12
  price            DECIMAL(10,2)  NOT NULL,
  features         JSON               NULL,           -- ["Full gym access", "Locker", ...]
  is_active        TINYINT(1)     NOT NULL DEFAULT 1, -- 1 = available, 0 = hidden
  created_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ── 2.4  members ─────────────────────────────────────────────
--  Core member records.
--  membership_plan_id → which plan they are on.
--  trainer_id         → assigned trainer (optional, NULL allowed).
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS members;
CREATE TABLE members (
  id                  INT           NOT NULL AUTO_INCREMENT,
  full_name           VARCHAR(100)  NOT NULL,
  age                 TINYINT UNSIGNED  NULL,
  gender              ENUM('male', 'female', 'other', 'prefer_not_to_say')
                      NOT NULL DEFAULT 'prefer_not_to_say',
  phone               VARCHAR(15)   NOT NULL,
  email               VARCHAR(150)      NULL UNIQUE,
  address             TEXT              NULL,
  join_date           DATE          NOT NULL,
  membership_plan_id  INT               NULL,
  trainer_id          INT               NULL,
  membership_status   ENUM('active', 'expiring', 'expired', 'suspended')
                      NOT NULL DEFAULT 'active',
  membership_expiry   DATE              NULL,         -- calculated on enrol/renew
  emergency_contact   VARCHAR(100)      NULL,
  emergency_phone     VARCHAR(15)       NULL,
  medical_notes       TEXT              NULL,
  created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                      ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_members_status   (membership_status),
  INDEX idx_members_plan     (membership_plan_id),
  INDEX idx_members_trainer  (trainer_id),
  INDEX idx_members_expiry   (membership_expiry),

  CONSTRAINT fk_members_plan
    FOREIGN KEY (membership_plan_id)
    REFERENCES membership_plans (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_members_trainer
    FOREIGN KEY (trainer_id)
    REFERENCES trainers (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ── 2.5  payments ────────────────────────────────────────────
--  Every payment transaction lives here.
--  payment_status: 'paid', 'pending', 'overdue', 'refunded'.
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS payments;
CREATE TABLE payments (
  id              INT            NOT NULL AUTO_INCREMENT,
  member_id       INT            NOT NULL,
  plan_id         INT                NULL,            -- plan being paid for
  amount          DECIMAL(10,2)  NOT NULL,
  payment_method  ENUM('cash', 'upi', 'card', 'net_banking', 'other')
                  NOT NULL DEFAULT 'cash',
  payment_status  ENUM('paid', 'pending', 'overdue', 'refunded')
                  NOT NULL DEFAULT 'pending',
  payment_date    DATE               NULL,            -- NULL if not yet paid
  reference_no    VARCHAR(100)       NULL,            -- UPI ref, receipt no, etc.
  notes           TEXT               NULL,
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_payments_member  (member_id),
  INDEX idx_payments_status  (payment_status),
  INDEX idx_payments_date    (payment_date),

  CONSTRAINT fk_payments_member
    FOREIGN KEY (member_id)
    REFERENCES members (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_payments_plan
    FOREIGN KEY (plan_id)
    REFERENCES membership_plans (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ── 2.6  attendance ──────────────────────────────────────────
--  One row per member per day.
--  status: 'present', 'absent', 'late'.
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS attendance;
CREATE TABLE attendance (
  id               INT      NOT NULL AUTO_INCREMENT,
  member_id        INT      NOT NULL,
  attendance_date  DATE     NOT NULL,
  check_in_time    TIME         NULL,
  check_out_time   TIME         NULL,
  status           ENUM('present', 'absent', 'late')
                   NOT NULL DEFAULT 'present',
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  -- Prevent duplicate entries for the same member on the same day
  UNIQUE KEY uq_attendance_member_date (member_id, attendance_date),

  INDEX idx_attendance_date   (attendance_date),
  INDEX idx_attendance_status (status),

  CONSTRAINT fk_attendance_member
    FOREIGN KEY (member_id)
    REFERENCES members (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ── Re-enable FK checks ───────────────────────────────────────
SET FOREIGN_KEY_CHECKS = 1;


-- ============================================================
--  3. SEED DATA
-- ============================================================

-- ── 3.1  Admin ───────────────────────────────────────────────
--  Password: admin123
--  Hash generated with:  bcrypt.hash('admin123', 10)
-- ────────────────────────────────────────────────────────────
INSERT INTO admins (full_name, email, password, role) VALUES
(
  'Admin Ravi',
  'admin@ironforge.com',
  '$2b$10$BSBRgmaL4MYQ.wCz63dA2O5KlI0KrQM30M38PUPiD/6wMcEz5Z9d6',
  'super_admin'
);


-- ── 3.2  Membership Plans ────────────────────────────────────
INSERT INTO membership_plans (plan_name, duration_months, price, features) VALUES
(
  'Monthly',
  1,
  1500.00,
  '["Full gym access", "Group classes", "Locker access"]'
),
(
  'Quarterly',
  3,
  4200.00,
  '["Full gym access", "Group classes", "Locker access", "1 trainer session/month", "Priority equipment booking"]'
),
(
  'Annual',
  12,
  12000.00,
  '["Full gym access", "Unlimited group classes", "Locker + towel service", "4 trainer sessions/month", "Diet & nutrition plan", "Guest pass (1/month)", "Priority equipment booking"]'
);


-- ── 3.3  Trainers ────────────────────────────────────────────
INSERT INTO trainers (trainer_name, specialization, phone, email, experience_years, salary, status) VALUES
('Suresh Kumar',  'Strength & Conditioning', '9876543210', 'suresh@ironforge.com',  8,  42000.00, 'active'),
('Anita Desai',   'Yoga & Flexibility',      '9812345678', 'anita@ironforge.com',   6,  36000.00, 'active'),
('Rajesh Pillai', 'CrossFit & HIIT',         '9823456789', 'rajesh@ironforge.com',  9,  45000.00, 'active'),
('Kavitha Rao',   'Zumba & Cardio',          '9834567890', 'kavitha@ironforge.com', 5,  33000.00, 'active'),
('Mohan Singh',   'Bodybuilding',            '9845678901', 'mohan@ironforge.com',   11, 50000.00, 'active');


-- ── 3.4  Members ─────────────────────────────────────────────
--  membership_expiry is calculated from join_date + plan duration
-- ────────────────────────────────────────────────────────────
INSERT INTO members
  (full_name, age, gender, phone, email, address, join_date,
   membership_plan_id, trainer_id, membership_status, membership_expiry,
   emergency_contact, emergency_phone)
VALUES
-- Annual plan members
(
  'Arjun Reddy', 28, 'male', '9876543211', 'arjun.reddy@email.com',
  '42, Koramangala 5th Block, Bengaluru - 560095',
  '2024-06-01', 3, 1, 'active', '2025-06-01',
  'Suresh Reddy', '9876543000'
),
(
  'Kiran Rao', 31, 'male', '9856789012', 'kiran.rao@email.com',
  '17, HSR Layout Sector 2, Bengaluru - 560102',
  '2025-05-12', 3, 3, 'active', '2026-05-12',
  'Anand Rao', '9856789000'
),
(
  'Sneha Patil', 24, 'female', '9889012345', 'sneha.patil@email.com',
  '8, Indiranagar 100 Feet Road, Bengaluru - 560038',
  '2025-01-10', 3, 2, 'active', '2026-01-10',
  'Ramesh Patil', '9889012000'
),
(
  'Rohan Gupta', 35, 'male', '9811234567', 'rohan.gupta@email.com',
  '55, Whitefield Main Road, Bengaluru - 560066',
  '2024-08-01', 3, 1, 'active', '2025-08-01',
  'Priya Gupta', '9811234000'
),
(
  'Ravi Varma', 29, 'male', '9845678901', 'ravi.varma@email.com',
  '23, JP Nagar Phase 3, Bengaluru - 560078',
  '2024-05-20', 3, 3, 'expiring', '2025-05-20',
  'Meena Varma', '9845678000'
),
-- Quarterly plan members
(
  'Deepak Nair', 27, 'male', '9878901234', 'deepak.nair@email.com',
  '11, Malleswaram 15th Cross, Bengaluru - 560003',
  '2025-03-01', 2, 4, 'active', '2025-06-01',
  'Vijay Nair', '9878901000'
),
(
  'Sanjay Kumar', 33, 'male', '9823456789', 'sanjay.kumar@email.com',
  '34, RT Nagar Main Road, Bengaluru - 560032',
  '2025-02-01', 2, 1, 'expired', '2025-05-01',
  'Lata Kumar', '9823456000'
),
(
  'Lakshmi Naidu', 26, 'female', '9801234567', 'lakshmi.naidu@email.com',
  '9, Basavanagudi VV Puram, Bengaluru - 560004',
  '2025-02-15', 2, 2, 'expiring', '2025-05-15',
  'Ravi Naidu', '9801234000'
),
-- Monthly plan members
(
  'Priya Mehta', 22, 'female', '9812345678', 'priya.mehta@email.com',
  '61, Rajajinagar 2nd Block, Bengaluru - 560010',
  '2025-04-15', 1, 2, 'expiring', '2025-05-15',
  'Sunil Mehta', '9812345000'
),
(
  'Meena Iyer', 30, 'female', '9867890123', 'meena.iyer@email.com',
  '3, Jayanagar 4th Block, Bengaluru - 560041',
  '2025-05-01', 1, 5, 'active', '2025-06-01',
  'Krishna Iyer', '9867890000'
);


-- ── 3.5  Payments ────────────────────────────────────────────
INSERT INTO payments
  (member_id, plan_id, amount, payment_method, payment_status, payment_date, reference_no)
VALUES
-- Paid
(1,  3, 12000.00, 'net_banking', 'paid',    '2024-06-01', 'NB2024060101'),
(1,  3, 12000.00, 'net_banking', 'paid',    '2025-05-12', 'NB2025051201'), -- renewal
(2,  3, 12000.00, 'upi',         'paid',    '2025-05-12', 'UPI2025051201'),
(3,  3, 12000.00, 'card',        'paid',    '2025-01-10', 'CRD2025011001'),
(4,  3, 12000.00, 'net_banking', 'paid',    '2024-08-01', 'NB2024080101'),
(6,  2,  4200.00, 'upi',         'paid',    '2025-03-01', 'UPI2025030101'),
(9,  1,  1500.00, 'upi',         'paid',    '2025-04-15', 'UPI2025041501'),
(10, 1,  1500.00, 'cash',        'paid',    '2025-05-01', 'CSH2025050101'),
-- Pending
(7,  2,  4200.00, 'cash',        'pending',  NULL, NULL),
(9,  1,  1500.00, 'upi',         'pending',  NULL, NULL),  -- upcoming renewal
-- Overdue
(5,  3, 12000.00, 'net_banking', 'overdue',  NULL, NULL),
(8,  2,  4200.00, 'upi',         'overdue',  NULL, NULL);


-- ── 3.6  Attendance (last 7 days for active members) ─────────
--  Dates relative to 2025-05-13 (system "today")
-- ────────────────────────────────────────────────────────────
INSERT INTO attendance (member_id, attendance_date, check_in_time, check_out_time, status)
VALUES
-- 2025-05-13 (today)
(1,  '2025-05-13', '06:15:00', '07:45:00', 'present'),
(2,  '2025-05-13', '06:30:00', '08:00:00', 'present'),
(3,  '2025-05-13', '07:30:00', '09:00:00', 'present'),
(4,  '2025-05-13', '08:00:00', '09:15:00', 'present'),
(6,  '2025-05-13', '07:15:00', '08:45:00', 'present'),
(9,  '2025-05-13', '09:05:00',  NULL,       'late'),
(10, '2025-05-13', '07:00:00', '08:20:00', 'present'),
(5,  '2025-05-13',  NULL,       NULL,       'absent'),
(7,  '2025-05-13',  NULL,       NULL,       'absent'),
(8,  '2025-05-13',  NULL,       NULL,       'absent'),

-- 2025-05-12
(1,  '2025-05-12', '06:10:00', '07:40:00', 'present'),
(2,  '2025-05-12', '06:45:00', '08:15:00', 'present'),
(3,  '2025-05-12', '07:00:00', '08:30:00', 'present'),
(6,  '2025-05-12', '08:30:00', '09:45:00', 'present'),
(9,  '2025-05-12', '06:30:00', '07:50:00', 'present'),
(10, '2025-05-12', '07:15:00', '08:35:00', 'present'),
(4,  '2025-05-12',  NULL,       NULL,       'absent'),
(5,  '2025-05-12',  NULL,       NULL,       'absent'),

-- 2025-05-11 (Sunday — lower attendance)
(1,  '2025-05-11', '08:00:00', '09:00:00', 'present'),
(3,  '2025-05-11', '08:30:00', '09:30:00', 'present'),
(10, '2025-05-11', '09:00:00', '10:00:00', 'present'),

-- 2025-05-10
(1,  '2025-05-10', '06:20:00', '07:50:00', 'present'),
(2,  '2025-05-10', '07:00:00', '08:30:00', 'present'),
(3,  '2025-05-10', '07:30:00', '09:00:00', 'present'),
(4,  '2025-05-10', '08:15:00', '09:30:00', 'present'),
(6,  '2025-05-10', '07:00:00', '08:15:00', 'present'),
(9,  '2025-05-10', '06:45:00', '08:00:00', 'present'),
(5,  '2025-05-10', '09:20:00',  NULL,       'late'),

-- 2025-05-09
(1,  '2025-05-09', '06:15:00', '07:45:00', 'present'),
(2,  '2025-05-09', '07:30:00', '09:00:00', 'present'),
(4,  '2025-05-09', '08:00:00', '09:10:00', 'present'),
(9,  '2025-05-09', '06:30:00', '07:45:00', 'present'),
(10, '2025-05-09', '07:00:00', '08:10:00', 'present'),
(6,  '2025-05-09',  NULL,       NULL,       'absent');


-- ============================================================
--  4. USEFUL DASHBOARD QUERIES
--  These are reference queries your Express controllers will use.
--  They are commented out so they don't run on import —
--  copy them into your Node.js code as needed.
-- ============================================================

/*

-- ── Total members ────────────────────────────────────────────
SELECT COUNT(*) AS total_members
FROM members;


-- ── Active memberships ───────────────────────────────────────
SELECT COUNT(*) AS active_memberships
FROM members
WHERE membership_status = 'active';


-- ── Members expiring in the next 7 days ──────────────────────
SELECT
  id,
  full_name,
  phone,
  membership_expiry,
  DATEDIFF(membership_expiry, CURDATE()) AS days_left
FROM members
WHERE membership_status IN ('active', 'expiring')
  AND membership_expiry BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
ORDER BY membership_expiry ASC;


-- ── Monthly revenue (current month) ─────────────────────────
SELECT
  COALESCE(SUM(amount), 0) AS monthly_revenue
FROM payments
WHERE payment_status = 'paid'
  AND MONTH(payment_date)  = MONTH(CURDATE())
  AND YEAR(payment_date)   = YEAR(CURDATE());


-- ── Revenue by month (last 6 months) — for charts ────────────
SELECT
  DATE_FORMAT(payment_date, '%b %Y') AS month_label,
  MONTH(payment_date)                AS month_num,
  YEAR(payment_date)                 AS year_num,
  SUM(amount)                        AS revenue
FROM payments
WHERE payment_status = 'paid'
  AND payment_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY year_num, month_num, month_label
ORDER BY year_num ASC, month_num ASC;


-- ── Today's attendance count ─────────────────────────────────
SELECT
  COUNT(*)                                          AS total_checkins,
  SUM(status = 'present')                           AS present,
  SUM(status = 'late')                              AS late,
  SUM(status = 'absent')                            AS absent
FROM attendance
WHERE attendance_date = CURDATE();


-- ── Pending / overdue payments ───────────────────────────────
SELECT
  p.id,
  m.full_name,
  m.phone,
  pl.plan_name,
  p.amount,
  p.payment_status,
  p.created_at
FROM payments p
JOIN members          m  ON m.id  = p.member_id
LEFT JOIN membership_plans pl ON pl.id = p.plan_id
WHERE p.payment_status IN ('pending', 'overdue')
ORDER BY p.payment_status DESC, p.created_at ASC;


-- ── Revenue breakdown by plan ────────────────────────────────
SELECT
  pl.plan_name,
  COUNT(p.id)    AS transaction_count,
  SUM(p.amount)  AS total_revenue
FROM payments p
JOIN membership_plans pl ON pl.id = p.plan_id
WHERE p.payment_status = 'paid'
GROUP BY pl.id, pl.plan_name
ORDER BY total_revenue DESC;


-- ── Full member list with plan + trainer ─────────────────────
SELECT
  m.id,
  m.full_name,
  m.phone,
  m.email,
  m.membership_status,
  m.membership_expiry,
  pl.plan_name,
  t.trainer_name
FROM members m
LEFT JOIN membership_plans pl ON pl.id = m.membership_plan_id
LEFT JOIN trainers         t  ON t.id  = m.trainer_id
ORDER BY m.created_at DESC;


-- ── Attendance for a specific date ───────────────────────────
SELECT
  m.full_name,
  m.phone,
  a.check_in_time,
  a.check_out_time,
  a.status
FROM attendance a
JOIN members m ON m.id = a.member_id
WHERE a.attendance_date = '2025-05-13'
ORDER BY a.check_in_time ASC;


-- ── Top 5 most frequent members this month ───────────────────
SELECT
  m.full_name,
  COUNT(a.id) AS checkin_count
FROM attendance a
JOIN members m ON m.id = a.member_id
WHERE a.status    != 'absent'
  AND MONTH(a.attendance_date) = MONTH(CURDATE())
  AND YEAR(a.attendance_date)  = YEAR(CURDATE())
GROUP BY m.id, m.full_name
ORDER BY checkin_count DESC
LIMIT 5;


-- ── Trainer load (how many members each trainer has) ─────────
SELECT
  t.trainer_name,
  t.specialization,
  COUNT(m.id) AS assigned_members
FROM trainers t
LEFT JOIN members m ON m.trainer_id = t.id
  AND m.membership_status != 'expired'
GROUP BY t.id, t.trainer_name, t.specialization
ORDER BY assigned_members DESC;

*/


-- ============================================================
--  5. FINAL CHECK — row counts after import
-- ============================================================

SELECT 'admins'          AS tbl, COUNT(*) AS rows FROM admins          UNION ALL
SELECT 'trainers',               COUNT(*)          FROM trainers         UNION ALL
SELECT 'membership_plans',       COUNT(*)          FROM membership_plans UNION ALL
SELECT 'members',                COUNT(*)          FROM members          UNION ALL
SELECT 'payments',               COUNT(*)          FROM payments         UNION ALL
SELECT 'attendance',             COUNT(*)          FROM attendance;

-- ── Import complete ───────────────────────────────────────────
-- Expected output:
--   admins           | 1
--   trainers         | 5
--   membership_plans | 3
--   members          | 10
--   payments         | 12
--   attendance       | 35
-- ─────────────────────────────────────────────────────────────
