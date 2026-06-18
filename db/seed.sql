INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2026-06-10', '2026-06-13', 'OPEN'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', '2026-05-15', '2026-05-15', 'ORDERED');

INSERT INTO cart_items (cart_id, product_id, count) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '3001b03b-d4d3-4491-a35d-f75c8895798f', 2),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'db418177-a580-4109-9a41-40df1b8ee6f3', 1),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '98943c89-16a5-4385-bbb1-c5b1ce4b91e2', 3),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '63d52839-3a97-43ac-a9f3-62b68045eedd', 1);
