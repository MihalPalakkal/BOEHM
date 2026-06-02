-- Insert sample menu items
INSERT INTO menu_items (name, description, price, category, is_available) VALUES
('Burger Deluxe', 'Premium beef burger with special sauce', 12.99, 'Main Course', TRUE),
('Caesar Salad', 'Fresh greens with homemade dressing', 8.99, 'Salad', TRUE),
('Grilled Chicken', 'Seasoned grilled chicken breast', 14.99, 'Main Course', TRUE),
('Pasta Carbonara', 'Classic Italian pasta with cream sauce', 13.99, 'Pasta', TRUE),
('Fish Tacos', 'Fresh fish with lime and cilantro', 11.99, 'Main Course', TRUE);

-- Insert sample rewards
INSERT INTO rewards (name, points_required, description, is_active) VALUES
('Free Drink', 50, 'Get a free beverage of your choice', TRUE),
('$5 Off', 100, 'Receive $5 off your next order', TRUE),
('Free Dessert', 75, 'Enjoy a complimentary dessert', TRUE),
('Free Appetizer', 60, 'Get a free appetizer with your meal', TRUE);
