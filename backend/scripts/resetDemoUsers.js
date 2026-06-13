const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const DEMO_PASSWORD = 'password123';
const DEMO_USERS = [
  { email: 'alice@example.com', name: 'Alice Johnson', phone: '555-0101', points: 1250, tier: 'Silver' },
  { email: 'bob@example.com', name: 'Bob Smith', phone: '555-0102', points: 450, tier: 'Bronze' },
  { email: 'carol@example.com', name: 'Carol White', phone: '555-0103', points: 5300, tier: 'Gold' },
];

const TIER_VALUES = [
  ['Bronze', 0, 999, 1],
  ['Silver', 1000, 4999, 2],
  ['Gold', 5000, 9999, 3],
  ['Platinum', 10000, null, 4],
];

const resetDemoUsers = async () => {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await pool.query(
    `INSERT INTO loyalty_tiers (name, min_points, max_points, sort_order)
     VALUES ?
     ON DUPLICATE KEY UPDATE
       min_points = VALUES(min_points),
       max_points = VALUES(max_points),
       sort_order = VALUES(sort_order)`,
    [TIER_VALUES]
  );

  await pool.query(
    `INSERT INTO users (email, password, name, phone, is_active)
     VALUES ?
     ON DUPLICATE KEY UPDATE
       password = VALUES(password),
       name = VALUES(name),
       phone = VALUES(phone),
       is_active = TRUE`,
    [DEMO_USERS.map((user) => [user.email, passwordHash, user.name, user.phone, true])]
  );

  await pool.query(
    `INSERT INTO loyalty_points (user_id, points, tier_id)
     SELECT u.id, demo.points, lt.id
     FROM (
       SELECT ? AS email, ? AS points, ? AS tier
       UNION ALL SELECT ?, ?, ?
       UNION ALL SELECT ?, ?, ?
     ) demo
     JOIN users u ON u.email = demo.email
     JOIN loyalty_tiers lt ON lt.name = demo.tier
     ON DUPLICATE KEY UPDATE
       points = VALUES(points),
       tier_id = VALUES(tier_id)`,
    DEMO_USERS.flatMap((user) => [user.email, user.points, user.tier])
  );

  console.log('Demo users are ready.');
  console.log(`Password for alice@example.com, bob@example.com, and carol@example.com: ${DEMO_PASSWORD}`);
};

resetDemoUsers()
  .catch((error) => {
    console.error('Failed to reset demo users.');
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
