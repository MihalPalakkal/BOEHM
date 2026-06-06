-- Migration: 002_upgrade_from_old_schema.sql
-- Description: Upgrade an existing BOEHM DB (old schema.sql) to the
--              full schema.  Safe to run if you already ran the old
--              schema.sql and have live data.
-- Created: 2026-06-04
--
-- Run:  mysql -u root -p boehm < database/migrations/002_upgrade_from_old_schema.sql

USE boehm;

-- ── 1. users — add new columns ────────────────────────────
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(500) AFTER phone,
  ADD COLUMN IF NOT EXISTS is_active       BOOLEAN NOT NULL DEFAULT TRUE AFTER profile_picture;

CREATE INDEX IF NOT EXISTS idx_users_email     ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- ── 2. refresh_tokens ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         INT          PRIMARY KEY AUTO_INCREMENT,
  user_id    INT          NOT NULL,
  token      VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP    NOT NULL,
  revoked    BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_refresh_tokens_user   (user_id),
  INDEX idx_refresh_tokens_token  (token(64)),
  INDEX idx_refresh_tokens_expiry (expires_at)
);

-- ── 3. menu_categories ────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_categories (
  id         INT          PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL UNIQUE,
  sort_order INT          NOT NULL DEFAULT 0,
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_menu_categories_active (is_active),
  INDEX idx_menu_categories_sort   (sort_order)
);

-- Populate categories from existing menu_items.category column
INSERT IGNORE INTO menu_categories (name)
SELECT DISTINCT category FROM menu_items WHERE category IS NOT NULL;

-- ── 4. menu_items — add new columns & FK ──────────────────
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS category_id  INT         AFTER id,
  ADD COLUMN IF NOT EXISTS prep_time    VARCHAR(20) AFTER image_url,
  ADD COLUMN IF NOT EXISTS calories     INT         AFTER prep_time,
  ADD COLUMN IF NOT EXISTS spice_level  TINYINT     NOT NULL DEFAULT 0 AFTER calories,
  ADD COLUMN IF NOT EXISTS accent_color VARCHAR(20) AFTER spice_level,
  ADD COLUMN IF NOT EXISTS is_featured  BOOLEAN     NOT NULL DEFAULT FALSE AFTER is_available,
  ADD COLUMN IF NOT EXISTS sort_order   INT         NOT NULL DEFAULT 0 AFTER is_featured;

-- Back-fill category_id from old text column
UPDATE menu_items mi
  JOIN menu_categories mc ON mc.name = mi.category
SET mi.category_id = mc.id
WHERE mi.category_id IS NULL;

ALTER TABLE menu_items
  ADD CONSTRAINT IF NOT EXISTS fk_menu_items_category
    FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_menu_items_category  ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_featured  ON menu_items(is_featured);

-- ── 5. menu_item_tags ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_item_tags (
  id           INT          PRIMARY KEY AUTO_INCREMENT,
  menu_item_id INT          NOT NULL,
  tag          VARCHAR(100) NOT NULL,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
  UNIQUE KEY uq_item_tag (menu_item_id, tag),
  INDEX idx_tags_item (menu_item_id)
);

-- ── 6. loyalty_tiers ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS loyalty_tiers (
  id         INT         PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(50) NOT NULL UNIQUE,
  min_points INT         NOT NULL,
  max_points INT,
  sort_order INT         NOT NULL DEFAULT 0,
  created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tiers_sort (sort_order)
);

INSERT IGNORE INTO loyalty_tiers (name, min_points, max_points, sort_order) VALUES
  ('Bronze',   0,     999,   1),
  ('Silver',   1000,  4999,  2),
  ('Gold',     5000,  9999,  3),
  ('Platinum', 10000, NULL,  4);

-- ── 7. loyalty_points — add tier_id FK ───────────────────
ALTER TABLE loyalty_points
  ADD COLUMN IF NOT EXISTS tier_id INT NOT NULL DEFAULT 1 AFTER tier;

UPDATE loyalty_points lp
  JOIN loyalty_tiers lt ON lt.name = lp.tier
SET lp.tier_id = lt.id;

ALTER TABLE loyalty_points
  ADD CONSTRAINT IF NOT EXISTS fk_loyalty_points_tier
    FOREIGN KEY (tier_id) REFERENCES loyalty_tiers(id);

-- ── 8. loyalty_points_history ─────────────────────────────
CREATE TABLE IF NOT EXISTS loyalty_points_history (
  id            INT          PRIMARY KEY AUTO_INCREMENT,
  user_id       INT          NOT NULL,
  change_amount INT          NOT NULL,
  balance_after INT          NOT NULL,
  reason        VARCHAR(100) NOT NULL,
  reference_id  INT,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_points_history_user   (user_id),
  INDEX idx_points_history_date   (created_at),
  INDEX idx_points_history_reason (reason)
);

-- ── 9. orders — add new columns ──────────────────────────
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method        VARCHAR(50) AFTER delivery_address,
  ADD COLUMN IF NOT EXISTS notes                 TEXT        AFTER payment_method,
  ADD COLUMN IF NOT EXISTS estimated_delivery_at TIMESTAMP   AFTER notes,
  ADD COLUMN IF NOT EXISTS cancelled_at          TIMESTAMP   AFTER estimated_delivery_at;

-- Change status from VARCHAR to ENUM (only safe when existing values match)
-- If you have custom statuses, add them to the ENUM below first.
ALTER TABLE orders
  MODIFY COLUMN status ENUM(
    'pending','confirmed','preparing','ready',
    'out_for_delivery','delivered','cancelled'
  ) NOT NULL DEFAULT 'pending';

CREATE INDEX IF NOT EXISTS idx_orders_user   ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date   ON orders(created_at);

-- ── 10. order_items ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id           INT            PRIMARY KEY AUTO_INCREMENT,
  order_id     INT            NOT NULL,
  menu_item_id INT            NOT NULL,
  quantity     INT            NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price   DECIMAL(10,2)  NOT NULL,
  subtotal     DECIMAL(10,2)  GENERATED ALWAYS AS (quantity * unit_price) STORED,
  notes        VARCHAR(255),
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id)     REFERENCES orders(id)     ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT,
  INDEX idx_order_items_order (order_id),
  INDEX idx_order_items_item  (menu_item_id)
);

-- ── 11. user_rewards — add status & expires_at ───────────
ALTER TABLE user_rewards
  ADD COLUMN IF NOT EXISTS status     ENUM('available','redeemed','expired')
                                      NOT NULL DEFAULT 'available' AFTER reward_id,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP AFTER redeemed_at;

-- Back-fill status from redeemed_at
UPDATE user_rewards
SET status = 'redeemed'
WHERE redeemed_at IS NOT NULL AND status = 'available';

CREATE INDEX IF NOT EXISTS idx_user_rewards_user   ON user_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_status ON user_rewards(status);

-- ── 12. notifications ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id           INT          PRIMARY KEY AUTO_INCREMENT,
  user_id      INT          NOT NULL,
  title        VARCHAR(255) NOT NULL,
  body         TEXT         NOT NULL,
  type         VARCHAR(50),
  reference_id INT,
  is_read      BOOLEAN      NOT NULL DEFAULT FALSE,
  sent_at      TIMESTAMP,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notifications_user (user_id),
  INDEX idx_notifications_read (is_read),
  INDEX idx_notifications_type (type)
);

SELECT '002_upgrade_from_old_schema applied successfully' AS status;
