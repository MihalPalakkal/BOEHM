-- =============================================================
--  BOEHM Restaurant Ordering & Loyalty System
--  Database Schema — MySQL 8.0+
--  Run: mysql -u root -p < database/schema.sql
-- =============================================================

CREATE DATABASE IF NOT EXISTS boehm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE boehm;

-- -----------------------------------------------------------
-- 1. USERS
-- -----------------------------------------------------------
CREATE TABLE users (
  id              INT            PRIMARY KEY AUTO_INCREMENT,
  email           VARCHAR(255)   NOT NULL UNIQUE,
  password        VARCHAR(255)   NOT NULL,
  name            VARCHAR(255)   NOT NULL,
  phone           VARCHAR(20),
  profile_picture VARCHAR(500),
  is_active       BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_email (email),
  INDEX idx_users_is_active (is_active)
);

-- -----------------------------------------------------------
-- 2. REFRESH TOKENS  (JWT rotation)
-- -----------------------------------------------------------
CREATE TABLE refresh_tokens (
  id          INT          PRIMARY KEY AUTO_INCREMENT,
  user_id     INT          NOT NULL,
  token       VARCHAR(500) NOT NULL UNIQUE,
  expires_at  TIMESTAMP    NOT NULL,
  revoked     BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_refresh_tokens_user   (user_id),
  INDEX idx_refresh_tokens_token  (token(64)),
  INDEX idx_refresh_tokens_expiry (expires_at)
);

-- -----------------------------------------------------------
-- 3. MENU CATEGORIES
-- -----------------------------------------------------------
CREATE TABLE menu_categories (
  id          INT          PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL UNIQUE,
  sort_order  INT          NOT NULL DEFAULT 0,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_menu_categories_active (is_active),
  INDEX idx_menu_categories_sort   (sort_order)
);

-- -----------------------------------------------------------
-- 4. MENU ITEMS
-- -----------------------------------------------------------
CREATE TABLE menu_items (
  id            INT             PRIMARY KEY AUTO_INCREMENT,
  category_id   INT,
  name          VARCHAR(255)    NOT NULL,
  description   TEXT,
  price         DECIMAL(10, 2)  NOT NULL,
  image_url     VARCHAR(500),
  prep_time     VARCHAR(20),                       -- e.g. "14 min"
  calories      INT,
  spice_level   TINYINT         NOT NULL DEFAULT 0 CHECK (spice_level BETWEEN 0 AND 5),
  accent_color  VARCHAR(20),                       -- hex colour used in UI
  is_available  BOOLEAN         NOT NULL DEFAULT TRUE,
  is_featured   BOOLEAN         NOT NULL DEFAULT FALSE,
  sort_order    INT             NOT NULL DEFAULT 0,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE SET NULL,
  INDEX idx_menu_items_category  (category_id),
  INDEX idx_menu_items_available (is_available),
  INDEX idx_menu_items_featured  (is_featured)
);

-- -----------------------------------------------------------
-- 5. MENU ITEM TAGS  (e.g. "Best seller", "Vegetarian", …)
-- -----------------------------------------------------------
CREATE TABLE menu_item_tags (
  id           INT          PRIMARY KEY AUTO_INCREMENT,
  menu_item_id INT          NOT NULL,
  tag          VARCHAR(100) NOT NULL,

  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
  UNIQUE KEY uq_item_tag (menu_item_id, tag),
  INDEX idx_tags_item (menu_item_id)
);

-- -----------------------------------------------------------
-- 6. LOYALTY TIERS
-- -----------------------------------------------------------
CREATE TABLE loyalty_tiers (
  id          INT          PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(50)  NOT NULL UNIQUE,
  min_points  INT          NOT NULL,
  max_points  INT,                        -- NULL means no upper bound (top tier)
  sort_order  INT          NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_tiers_sort (sort_order)
);

-- -----------------------------------------------------------
-- 7. REWARDS
-- -----------------------------------------------------------
CREATE TABLE rewards (
  id               INT            PRIMARY KEY AUTO_INCREMENT,
  name             VARCHAR(255)   NOT NULL,
  description      TEXT,
  points_required  INT            NOT NULL,
  is_active        BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_rewards_active  (is_active),
  INDEX idx_rewards_points  (points_required)
);

-- -----------------------------------------------------------
-- 8. LOYALTY POINTS  (one row per user — running total)
-- -----------------------------------------------------------
CREATE TABLE loyalty_points (
  id          INT         PRIMARY KEY AUTO_INCREMENT,
  user_id     INT         NOT NULL UNIQUE,
  points      INT         NOT NULL DEFAULT 0,
  tier_id     INT         NOT NULL,
  created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (tier_id)  REFERENCES loyalty_tiers(id),
  INDEX idx_loyalty_user (user_id)
);

-- -----------------------------------------------------------
-- 9. LOYALTY POINTS HISTORY  (full audit trail)
-- -----------------------------------------------------------
CREATE TABLE loyalty_points_history (
  id            INT           PRIMARY KEY AUTO_INCREMENT,
  user_id       INT           NOT NULL,
  change_amount INT           NOT NULL,            -- positive = earned, negative = spent
  balance_after INT           NOT NULL,
  reason        VARCHAR(100)  NOT NULL,            -- e.g. 'order_placed', 'reward_redeemed'
  reference_id  INT,                              -- order_id or user_reward_id
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_points_history_user   (user_id),
  INDEX idx_points_history_date   (created_at),
  INDEX idx_points_history_reason (reason)
);

-- -----------------------------------------------------------
-- 10. ORDERS
-- -----------------------------------------------------------
CREATE TABLE orders (
  id                     INT             PRIMARY KEY AUTO_INCREMENT,
  user_id                INT             NOT NULL,
  status                 ENUM(
                           'pending',
                           'confirmed',
                           'preparing',
                           'ready',
                           'out_for_delivery',
                           'delivered',
                           'cancelled'
                         )               NOT NULL DEFAULT 'pending',
  total_amount           DECIMAL(10, 2)  NOT NULL,
  delivery_address       VARCHAR(500),
  payment_method         VARCHAR(50),               -- e.g. 'card', 'cash', 'wallet'
  notes                  TEXT,
  estimated_delivery_at  TIMESTAMP,
  cancelled_at           TIMESTAMP,
  created_at             TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_orders_user   (user_id),
  INDEX idx_orders_status (status),
  INDEX idx_orders_date   (created_at)
);

-- -----------------------------------------------------------
-- 11. ORDER ITEMS  (line items for each order)
-- -----------------------------------------------------------
CREATE TABLE order_items (
  id            INT             PRIMARY KEY AUTO_INCREMENT,
  order_id      INT             NOT NULL,
  menu_item_id  INT             NOT NULL,
  quantity      INT             NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price    DECIMAL(10, 2)  NOT NULL,   -- snapshot of price at time of order
  subtotal      DECIMAL(10, 2)  GENERATED ALWAYS AS (quantity * unit_price) STORED,
  notes         VARCHAR(255),               -- special instructions per item
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (order_id)     REFERENCES orders(id)     ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT,
  INDEX idx_order_items_order (order_id),
  INDEX idx_order_items_item  (menu_item_id)
);

-- -----------------------------------------------------------
-- 12. USER REWARDS  (redeemed / available rewards per user)
-- -----------------------------------------------------------
CREATE TABLE user_rewards (
  id           INT       PRIMARY KEY AUTO_INCREMENT,
  user_id      INT       NOT NULL,
  reward_id    INT       NOT NULL,
  status       ENUM('available', 'redeemed', 'expired') NOT NULL DEFAULT 'available',
  redeemed_at  TIMESTAMP,
  expires_at   TIMESTAMP,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)  REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (reward_id) REFERENCES rewards(id) ON DELETE RESTRICT,
  INDEX idx_user_rewards_user   (user_id),
  INDEX idx_user_rewards_status (status)
);

-- -----------------------------------------------------------
-- 13. NOTIFICATIONS
-- -----------------------------------------------------------
CREATE TABLE notifications (
  id          INT           PRIMARY KEY AUTO_INCREMENT,
  user_id     INT           NOT NULL,
  title       VARCHAR(255)  NOT NULL,
  body        TEXT          NOT NULL,
  type        VARCHAR(50),                -- e.g. 'order_update', 'reward_earned'
  reference_id INT,                       -- order_id, reward_id, etc.
  is_read     BOOLEAN       NOT NULL DEFAULT FALSE,
  sent_at     TIMESTAMP,                  -- NULL if not yet dispatched via Firebase
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notifications_user   (user_id),
  INDEX idx_notifications_read   (is_read),
  INDEX idx_notifications_type   (type)
);
