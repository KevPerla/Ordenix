CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_rol_enum') THEN
    CREATE TYPE users_rol_enum AS ENUM ('CLIENTE', 'ADMINISTRADOR', 'REPARTIDOR');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo VARCHAR(150)   NOT NULL,
  correo          VARCHAR(255)   NOT NULL UNIQUE,
  telefono        VARCHAR(30)    NOT NULL,
  password_hash   VARCHAR(255)   NOT NULL,
  rol             users_rol_enum NOT NULL DEFAULT 'CLIENTE',
  activo          BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT now(),

  CONSTRAINT chk_users_password_hasheada
    CHECK (password_hash ~ '^\$2[aby]\$')
);

CREATE INDEX IF NOT EXISTS idx_users_rol ON users (rol);
CREATE INDEX IF NOT EXISTS idx_users_activo ON users (activo);

CREATE TABLE IF NOT EXISTS addresses (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  etiqueta           VARCHAR(50),
  direccion_completa TEXT NOT NULL,
  referencia         VARCHAR(255),
  latitud            NUMERIC(9, 6),
  longitud           NUMERIC(9, 6),
  es_principal       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses (user_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_addresses_una_principal
  ON addresses (user_id)
  WHERE es_principal = TRUE;

CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  activo      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories (id) ON DELETE RESTRICT,
  nombre      VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio      NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
  imagen_url  VARCHAR(500),
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  disponible  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_disponible ON products (disponible);

CREATE TABLE IF NOT EXISTS cash_settlements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repartidor_id   UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  periodo_inicio  TIMESTAMPTZ NOT NULL,
  periodo_fin     TIMESTAMPTZ NOT NULL,
  monto_esperado  NUMERIC(10, 2) NOT NULL CHECK (monto_esperado >= 0),
  monto_entregado NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (monto_entregado >= 0),
  diferencia      NUMERIC(10, 2) GENERATED ALWAYS AS (monto_entregado - monto_esperado) STORED,
  estado          VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
  verificado_por  UUID REFERENCES users (id) ON DELETE SET NULL,
  verificado_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_settlements_estado
    CHECK (estado IN ('PENDIENTE', 'VERIFICADO', 'CON_DIFERENCIA')),
  CONSTRAINT chk_settlements_periodo
    CHECK (periodo_fin >= periodo_inicio)
);

CREATE INDEX IF NOT EXISTS idx_settlements_repartidor ON cash_settlements (repartidor_id);
CREATE INDEX IF NOT EXISTS idx_settlements_estado ON cash_settlements (estado);

CREATE TABLE IF NOT EXISTS orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id    UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  repartidor_id UUID REFERENCES users (id) ON DELETE SET NULL,
  address_id    UUID NOT NULL REFERENCES addresses (id) ON DELETE RESTRICT,
  settlement_id UUID REFERENCES cash_settlements (id) ON DELETE SET NULL,
  estado        VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
  metodo_pago   VARCHAR(20) NOT NULL DEFAULT 'EFECTIVO',
  subtotal      NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  total         NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  notas         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_orders_estado
    CHECK (estado IN ('PENDIENTE', 'EN_PREPARACION', 'LISTO_DESPACHO',
                      'EN_RUTA', 'ENTREGADO', 'CANCELADO')),
  CONSTRAINT chk_orders_metodo_pago
    CHECK (metodo_pago IN ('EFECTIVO'))
);

CREATE INDEX IF NOT EXISTS idx_orders_cliente ON orders (cliente_id);
CREATE INDEX IF NOT EXISTS idx_orders_repartidor ON orders (repartidor_id);
CREATE INDEX IF NOT EXISTS idx_orders_estado ON orders (estado);
CREATE INDEX IF NOT EXISTS idx_orders_settlement ON orders (settlement_id);

CREATE TABLE IF NOT EXISTS order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id      UUID NOT NULL REFERENCES products (id) ON DELETE RESTRICT,
  cantidad        INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(10, 2) NOT NULL CHECK (precio_unitario >= 0),
  subtotal        NUMERIC(10, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items (product_id);

CREATE TABLE IF NOT EXISTS order_status_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  estado_anterior VARCHAR(20),
  estado_nuevo    VARCHAR(20) NOT NULL,
  changed_by      UUID REFERENCES users (id) ON DELETE SET NULL,
  changed_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_status_history_order ON order_status_history (order_id);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
