# BOEHM — Database

MySQL 8.0+  ·  Character set: `utf8mb4`

---

## Quick Start

```bash
# 1. Create the database and all tables
mysql -u root -p < database/schema.sql

# 2. Load sample data (menu, rewards, demo users)
mysql -u root -p boehm < database/seed.sql
```

---

## Schema Overview

```
users
├── refresh_tokens          (JWT rotation)
├── loyalty_points          (running total per user)
│   └── loyalty_tiers       (Bronze / Silver / Gold / Platinum)
├── loyalty_points_history  (full audit trail of every change)
├── user_rewards            (rewards earned & redeemed per user)
│   └── rewards             (reward catalogue)
├── orders
│   └── order_items         (line items — menu_item snapshot)
│       └── menu_items
│           ├── menu_categories
│           └── menu_item_tags
└── notifications
```

### Tables

| Table | Purpose |
|---|---|
| `users` | Registered customers |
| `refresh_tokens` | JWT refresh-token rotation & revocation |
| `menu_categories` | e.g. Signatures, Bowls, Pizza, Drinks |
| `menu_items` | Full item data incl. calories, spice level, accent colour |
| `menu_item_tags` | Tags per item (e.g. "Best seller", "Vegetarian") |
| `loyalty_tiers` | Bronze → Silver → Gold → Platinum with point thresholds |
| `loyalty_points` | One row per user — current total & tier |
| `loyalty_points_history` | Every earned/spent points event |
| `rewards` | Reward catalogue with points cost |
| `user_rewards` | Which rewards each user has earned/redeemed |
| `orders` | Orders with status, payment method, delivery info |
| `order_items` | Line items (quantity × unit_price snapshot) |
| `notifications` | In-app & Firebase push notification records |

---

## Migrations

All changes to the schema live in `database/migrations/`.

| File | Description |
|---|---|
| `001_initial_schema.sql` | Records that the initial schema was applied |
| `002_upgrade_from_old_schema.sql` | Upgrades the old minimal schema to the full schema |

### Applying a migration

```bash
mysql -u root -p boehm < database/migrations/002_upgrade_from_old_schema.sql
```

> **Fresh install?** Just run `schema.sql` + `seed.sql` — you don't need the migration files.
> **Existing database?** Run `002_upgrade_from_old_schema.sql` to add all missing tables and columns safely.

---

## Environment Variables

Add to `backend/.env`:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=boehm
```

---

## Loyalty Tier Thresholds

| Tier | Min Points | Max Points |
|---|---|---|
| Bronze | 0 | 999 |
| Silver | 1 000 | 4 999 |
| Gold | 5 000 | 9 999 |
| Platinum | 10 000 | — |

---

## Demo Users (seed data)

| Email | Password | Points | Tier |
|---|---|---|---|
| alice@example.com | password123 | 1 250 | Silver |
| bob@example.com | password123 | 450 | Bronze |
| carol@example.com | password123 | 5 300 | Gold |

---

## Notes

- Prices in `menu_items` and `order_items.unit_price` are stored as `DECIMAL(10,2)`.
  The frontend currently expresses prices in pence/cents (e.g. `349` = £3.49 or $3.49).
  Align with your currency handling before going to production.
- `order_items.subtotal` is a **generated column** (`quantity × unit_price`), so you never need to calculate it manually.
- Passwords in `seed.sql` are bcrypt hashes of `password123` — change them before deploying.
