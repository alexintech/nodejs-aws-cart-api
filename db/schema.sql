CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE cart_status AS ENUM ('OPEN', 'ORDERED');

CREATE TABLE IF NOT EXISTS carts (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid NOT NULL,
  created_at date NOT NULL DEFAULT CURRENT_DATE,
  updated_at date NOT NULL DEFAULT CURRENT_DATE,
  status     cart_status NOT NULL DEFAULT 'OPEN'
);

CREATE TABLE IF NOT EXISTS cart_items (
  cart_id    uuid NOT NULL REFERENCES carts(id),
  product_id uuid NOT NULL,
  count      integer NOT NULL
);

CREATE TYPE order_status AS ENUM ('OPEN', 'ORDERED', 'APPROVED', 'CONFIRMED', 'SENT', 'COMPLETED', 'CANCELLED');

CREATE TABLE IF NOT EXISTS orders (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid NOT NULL,
  cart_id    uuid NOT NULL REFERENCES carts(id),
  payment    jsonb,
  delivery   jsonb,
  comments   text,
  status     order_status NOT NULL DEFAULT 'ORDERED',
  total      integer NOT NULL
);
