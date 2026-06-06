-- =============================================================
--  BOEHM — Seed Data
--  Run AFTER schema.sql:
--  mysql -u root -p boehm < database/seed.sql
-- =============================================================

USE boehm;

-- -----------------------------------------------------------
-- Loyalty Tiers  (must come before loyalty_points references)
-- -----------------------------------------------------------
INSERT INTO loyalty_tiers (name, min_points, max_points, sort_order) VALUES
  ('Bronze',   0,     999,   1),
  ('Silver',   1000,  4999,  2),
  ('Gold',     5000,  9999,  3),
  ('Platinum', 10000, NULL,  4);

-- -----------------------------------------------------------
-- Menu Categories
-- -----------------------------------------------------------
INSERT INTO menu_categories (name, sort_order) VALUES
  ('Signatures', 1),
  ('Bowls',      2),
  ('Pizza',      3),
  ('Pasta',      4),
  ('Garden',     5),
  ('Sides',      6),
  ('Dessert',    7),
  ('Drinks',     8);

-- -----------------------------------------------------------
-- Menu Items  (matches frontend/src/services/menuService.js)
-- -----------------------------------------------------------
INSERT INTO menu_items
  (category_id, name, description, price, image_url, prep_time, calories, spice_level, accent_color, is_featured, sort_order)
VALUES
  -- Signatures
  (
    (SELECT id FROM menu_categories WHERE name = 'Signatures'),
    'Smash Burger Royale',
    'Double beef patty, aged cheddar, house pickles, smoked tomato relish, brioche.',
    349.00,
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
    '14 min', 720, 1, '#b42318', TRUE, 1
  ),
  (
    (SELECT id FROM menu_categories WHERE name = 'Signatures'),
    'Crispy Fish Tacos',
    'Tempura cod, cabbage slaw, jalapeno crema, pickled onion, corn tortillas.',
    319.00,
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=900&q=80',
    '11 min', 520, 2, '#2f7f91', FALSE, 2
  ),
  -- Bowls
  (
    (SELECT id FROM menu_categories WHERE name = 'Bowls'),
    'Charred Chicken Bowl',
    'Herb grilled chicken, citrus rice, avocado, pico, black beans, lime crema.',
    329.00,
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    '12 min', 610, 2, '#237a57', TRUE, 1
  ),
  -- Pizza
  (
    (SELECT id FROM menu_categories WHERE name = 'Pizza'),
    'Wood Fired Margherita',
    'San Marzano tomato, mozzarella, basil, olive oil, crisp blistered crust.',
    429.00,
    'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=900&q=80',
    '16 min', 840, 0, '#d9822b', TRUE, 1
  ),
  -- Pasta
  (
    (SELECT id FROM menu_categories WHERE name = 'Pasta'),
    'Rigatoni Alla Vodka',
    'Bronze-cut rigatoni, tomato cream, parmesan, basil oil, toasted breadcrumbs.',
    389.00,
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80',
    '15 min', 760, 1, '#a7472b', FALSE, 1
  ),
  -- Garden
  (
    (SELECT id FROM menu_categories WHERE name = 'Garden'),
    'Roasted Beet Salad',
    'Baby greens, roasted beets, citrus, goat cheese, pistachio, sherry vinaigrette.',
    279.00,
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
    '8 min', 410, 0, '#7f3d7a', FALSE, 1
  ),
  -- Sides
  (
    (SELECT id FROM menu_categories WHERE name = 'Sides'),
    'Truffle Parm Fries',
    'Hand-cut fries, parmesan, herbs, cracked pepper, roasted garlic aioli.',
    189.00,
    'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=900&q=80',
    '7 min', 490, 0, '#9b6a1d', FALSE, 1
  ),
  -- Dessert
  (
    (SELECT id FROM menu_categories WHERE name = 'Dessert'),
    'Chocolate Olive Oil Cake',
    'Dark chocolate cake, whipped mascarpone, sea salt, berry compote.',
    229.00,
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
    '6 min', 530, 0, '#5b3a29', FALSE, 1
  ),
  -- Drinks
  (
    (SELECT id FROM menu_categories WHERE name = 'Drinks'),
    'Blood Orange Spritz',
    'Blood orange, rosemary, sparkling water, citrus peel, served over ice.',
    149.00,
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
    '3 min', 130, 0, '#c24634', FALSE, 1
  );

-- -----------------------------------------------------------
-- Menu Item Tags
-- -----------------------------------------------------------
INSERT INTO menu_item_tags (menu_item_id, tag)
SELECT id, 'Best seller'      FROM menu_items WHERE name = 'Smash Burger Royale'
UNION ALL
SELECT id, 'Contains dairy'   FROM menu_items WHERE name = 'Smash Burger Royale'
UNION ALL
SELECT id, 'High protein'     FROM menu_items WHERE name = 'Charred Chicken Bowl'
UNION ALL
SELECT id, 'Gluten free'      FROM menu_items WHERE name = 'Charred Chicken Bowl'
UNION ALL
SELECT id, 'Vegetarian'       FROM menu_items WHERE name = 'Wood Fired Margherita'
UNION ALL
SELECT id, 'Shareable'        FROM menu_items WHERE name = 'Wood Fired Margherita'
UNION ALL
SELECT id, 'Comfort pick'     FROM menu_items WHERE name = 'Rigatoni Alla Vodka'
UNION ALL
SELECT id, 'Bright'           FROM menu_items WHERE name = 'Crispy Fish Tacos'
UNION ALL
SELECT id, 'Contains seafood' FROM menu_items WHERE name = 'Crispy Fish Tacos'
UNION ALL
SELECT id, 'Vegetarian'       FROM menu_items WHERE name = 'Roasted Beet Salad'
UNION ALL
SELECT id, 'Fresh'            FROM menu_items WHERE name = 'Roasted Beet Salad'
UNION ALL
SELECT id, 'Shareable'        FROM menu_items WHERE name = 'Truffle Parm Fries'
UNION ALL
SELECT id, 'House dessert'    FROM menu_items WHERE name = 'Chocolate Olive Oil Cake'
UNION ALL
SELECT id, 'Zero proof'       FROM menu_items WHERE name = 'Blood Orange Spritz';

-- -----------------------------------------------------------
-- Rewards
-- -----------------------------------------------------------
INSERT INTO rewards (name, description, points_required, is_active) VALUES
  ('Free Drink',      'Get a free beverage of your choice with your next order.',   50,  TRUE),
  ('Free Appetizer',  'Enjoy a complimentary appetizer with your meal.',             60,  TRUE),
  ('Free Dessert',    'Treat yourself to a complimentary dessert.',                  75,  TRUE),
  ('$5 Off',          'Receive $5 off your next order.',                            100,  TRUE),
  ('$10 Off',         'Receive $10 off your next order — Gold members only.',       200,  TRUE),
  ('Free Main',       'One free main course — Platinum members only.',              500,  TRUE);

-- -----------------------------------------------------------
-- Demo Users  (passwords are bcrypt of "password123")
-- -----------------------------------------------------------
INSERT INTO users (email, password, name, phone) VALUES
  ('alice@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHi2',
   'Alice Johnson', '555-0101'),
  ('bob@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHi2',
   'Bob Smith', '555-0102'),
  ('carol@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHi2',
   'Carol White', '555-0103');

-- -----------------------------------------------------------
-- Loyalty Points for demo users
-- -----------------------------------------------------------
INSERT INTO loyalty_points (user_id, points, tier_id)
SELECT
  u.id,
  CASE u.email
    WHEN 'alice@example.com' THEN 1250   -- Silver
    WHEN 'bob@example.com'   THEN 450    -- Bronze
    WHEN 'carol@example.com' THEN 5300   -- Gold
  END,
  CASE u.email
    WHEN 'alice@example.com' THEN (SELECT id FROM loyalty_tiers WHERE name = 'Silver')
    WHEN 'bob@example.com'   THEN (SELECT id FROM loyalty_tiers WHERE name = 'Bronze')
    WHEN 'carol@example.com' THEN (SELECT id FROM loyalty_tiers WHERE name = 'Gold')
  END
FROM users u
WHERE u.email IN ('alice@example.com','bob@example.com','carol@example.com');

-- -----------------------------------------------------------
-- Sample Orders
-- -----------------------------------------------------------
INSERT INTO orders (user_id, status, total_amount, delivery_address, payment_method)
SELECT id, 'delivered', 718.00, '12 Oak Street, Apt 3B', 'card'
FROM users WHERE email = 'alice@example.com';

INSERT INTO orders (user_id, status, total_amount, delivery_address, payment_method)
SELECT id, 'preparing', 538.00, '7 Pine Road', 'card'
FROM users WHERE email = 'bob@example.com';

-- -----------------------------------------------------------
-- Order Items
-- -----------------------------------------------------------
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price)
SELECT
  (SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id
   WHERE u.email = 'alice@example.com' LIMIT 1),
  id, 1, price
FROM menu_items WHERE name = 'Smash Burger Royale';

INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price)
SELECT
  (SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id
   WHERE u.email = 'alice@example.com' LIMIT 1),
  id, 1, price
FROM menu_items WHERE name = 'Truffle Parm Fries';

INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price)
SELECT
  (SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id
   WHERE u.email = 'bob@example.com' LIMIT 1),
  id, 1, price
FROM menu_items WHERE name = 'Charred Chicken Bowl';

INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price)
SELECT
  (SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id
   WHERE u.email = 'bob@example.com' LIMIT 1),
  id, 1, price
FROM menu_items WHERE name = 'Blood Orange Spritz';

-- -----------------------------------------------------------
-- Points History for demo users
-- -----------------------------------------------------------
INSERT INTO loyalty_points_history (user_id, change_amount, balance_after, reason, reference_id)
SELECT
  u.id, 1250, 1250, 'order_placed',
  (SELECT o.id FROM orders o WHERE o.user_id = u.id LIMIT 1)
FROM users u WHERE u.email = 'alice@example.com';

INSERT INTO loyalty_points_history (user_id, change_amount, balance_after, reason, reference_id)
SELECT
  u.id, 450, 450, 'order_placed',
  (SELECT o.id FROM orders o WHERE o.user_id = u.id LIMIT 1)
FROM users u WHERE u.email = 'bob@example.com';

INSERT INTO loyalty_points_history (user_id, change_amount, balance_after, reason, reference_id)
SELECT u.id, 5300, 5300, 'order_placed', NULL
FROM users u WHERE u.email = 'carol@example.com';
