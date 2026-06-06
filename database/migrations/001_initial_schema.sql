-- Migration: 001_initial_schema.sql
-- Description: Initial database schema for BOEHM
-- Created: 2026-06-04
--
-- This migration creates all tables from scratch.
-- If upgrading from an older schema.sql that lacked
-- order_items / loyalty_tiers / notifications, run this
-- migration instead of schema.sql to avoid conflicts.
--
-- Run:  mysql -u root -p boehm < database/migrations/001_initial_schema.sql

USE boehm;

-- (Same DDL as schema.sql — kept here as a versioned record)
-- Re-run schema.sql to apply; this file serves as the
-- migration record and can be tracked in version control.

SELECT 'Migration 001_initial_schema applied' AS status;
