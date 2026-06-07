const pool = require('../config/database');

const tiers = [
  { id: 1, name: 'Bronze', minPoints: 0, maxPoints: 999 },
  { id: 2, name: 'Silver', minPoints: 1000, maxPoints: 4999 },
  { id: 3, name: 'Gold', minPoints: 5000, maxPoints: 9999 },
  { id: 4, name: 'Platinum', minPoints: 10000, maxPoints: null },
];

const getTierByPoints = (points) => {
  return tiers.find((t) => {
    if (t.maxPoints === null) return points >= t.minPoints;
    return points >= t.minPoints && points <= t.maxPoints;
  }) || tiers[0];
};

exports.getUserLoyalty = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT lp.user_id AS userId, lp.points, lt.id AS tierId, lt.name AS tier
       FROM loyalty_points lp
       JOIN loyalty_tiers lt ON lt.id = lp.tier_id
       WHERE lp.user_id = ?`,
      [userId]
    );

    if (rows.length > 0) {
      const loyalty = rows[0];

      const [rewards] = await connection.query(
        `SELECT ur.id, ur.status, ur.redeemed_at AS redeemedAt, ur.expires_at AS expiresAt,
                r.id AS rewardId, r.name, r.description, r.points_required AS pointsRequired
         FROM user_rewards ur
         JOIN rewards r ON r.id = ur.reward_id
         WHERE ur.user_id = ?
         ORDER BY ur.created_at DESC`,
        [userId]
      );

      return { ...loyalty, rewards };
    }

    const bronze = tiers[0];
    await connection.query(
      'INSERT INTO loyalty_points (user_id, points, tier_id) VALUES (?, 0, ?)',
      [userId, bronze.id]
    );

    return { userId: Number(userId), points: 0, tier: bronze.name, rewards: [] };
  } finally {
    connection.release();
  }
};

exports.getRewards = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [rewards] = await connection.query(
      `SELECT ur.id, ur.status, ur.redeemed_at AS redeemedAt, ur.expires_at AS expiresAt,
              r.id AS rewardId, r.name, r.description, r.points_required AS pointsRequired
       FROM user_rewards ur
       JOIN rewards r ON r.id = ur.reward_id
       WHERE ur.user_id = ?
       ORDER BY ur.created_at DESC`,
      [userId]
    );
    return rewards;
  } finally {
    connection.release();
  }
};

exports.redeemReward = async (userId, rewardId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [loyaltyRows] = await connection.query(
      'SELECT points FROM loyalty_points WHERE user_id = ?',
      [userId]
    );

    if (loyaltyRows.length === 0) throw new Error('Loyalty account not found');

    const [rewardRows] = await connection.query(
      'SELECT id, points_required AS pointsRequired FROM rewards WHERE id = ? AND is_active = TRUE',
      [rewardId]
    );

    if (rewardRows.length === 0) throw new Error('Reward not found');

    const reward = rewardRows[0];
    const currentPoints = loyaltyRows[0].points;

    if (currentPoints < reward.pointsRequired) {
      throw new Error('Not enough points to redeem this reward');
    }

    const [existingUserReward] = await connection.query(
      'SELECT id FROM user_rewards WHERE user_id = ? AND reward_id = ? AND status = "available" LIMIT 1',
      [userId, rewardId]
    );

    if (existingUserReward.length === 0) {
      await connection.query(
        `INSERT INTO user_rewards (user_id, reward_id, status, redeemed_at)
         VALUES (?, ?, 'redeemed', NOW())`,
        [userId, rewardId]
      );
    } else {
      await connection.query(
        `UPDATE user_rewards
         SET status = 'redeemed', redeemed_at = NOW()
         WHERE id = ?`,
        [existingUserReward[0].id]
      );
    }

    const newPoints = currentPoints - reward.pointsRequired;
    const tier = getTierByPoints(newPoints);

    await connection.query(
      'UPDATE loyalty_points SET points = ?, tier_id = ? WHERE user_id = ?',
      [newPoints, tier.id, userId]
    );

    await connection.query(
      `INSERT INTO loyalty_points_history
       (user_id, change_amount, balance_after, reason, reference_id)
       VALUES (?, ?, ?, 'reward_redeemed', ?)`,
      [userId, -reward.pointsRequired, newPoints, rewardId]
    );

    await connection.commit();

    return await exports.getUserLoyalty(userId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.getLoyaltyTiers = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT id, name, min_points AS minPoints, max_points AS maxPoints, sort_order AS sortOrder
       FROM loyalty_tiers
       ORDER BY sort_order ASC, min_points ASC`
    );
    return rows;
  } finally {
    connection.release();
  }
};

exports.getUserPoints = async (userId) => {
  const loyalty = await exports.getUserLoyalty(userId);
  return { userId, points: loyalty.points, tier: loyalty.tier };
};

exports.addPoints = async (userId, points, reason = 'order_placed', referenceId = null) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [existingRows] = await connection.query(
      'SELECT points, tier_id FROM loyalty_points WHERE user_id = ?',
      [userId]
    );

    if (existingRows.length === 0) {
      const bronze = tiers[0];
      await connection.query(
        'INSERT INTO loyalty_points (user_id, points, tier_id) VALUES (?, ?, ?)',
        [userId, points, bronze.id]
      );
    } else {
      const currentPoints = existingRows[0].points;
      const newPoints = currentPoints + points;
      const tier = getTierByPoints(newPoints);

      await connection.query(
        'UPDATE loyalty_points SET points = ?, tier_id = ? WHERE user_id = ?',
        [newPoints, tier.id, userId]
      );

      await connection.query(
        `INSERT INTO loyalty_points_history
         (user_id, change_amount, balance_after, reason, reference_id)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, points, newPoints, reason, referenceId]
      );
    }

    await connection.commit();
    return await exports.getUserLoyalty(userId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};