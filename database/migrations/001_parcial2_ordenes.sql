BEGIN;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS impuesto NUMERIC(10, 2) NOT NULL DEFAULT 0
    CHECK (impuesto >= 0);

ALTER TABLE orders DROP CONSTRAINT IF EXISTS chk_orders_estado;

UPDATE orders SET estado = 'CREADO'          WHERE estado = 'PENDIENTE';
UPDATE orders SET estado = 'EN_PREPARACION'  WHERE estado = 'LISTO_DESPACHO';
UPDATE orders SET estado = 'EN_CAMINO'       WHERE estado = 'EN_RUTA';

ALTER TABLE orders
  ADD CONSTRAINT chk_orders_estado
  CHECK (estado IN ('CREADO', 'PAGADO', 'EN_PREPARACION',
                    'EN_CAMINO', 'ENTREGADO', 'CANCELADO'));

ALTER TABLE orders ALTER COLUMN estado SET DEFAULT 'CREADO';

UPDATE order_status_history SET estado_anterior = 'CREADO'         WHERE estado_anterior = 'PENDIENTE';
UPDATE order_status_history SET estado_anterior = 'EN_PREPARACION' WHERE estado_anterior = 'LISTO_DESPACHO';
UPDATE order_status_history SET estado_anterior = 'EN_CAMINO'      WHERE estado_anterior = 'EN_RUTA';
UPDATE order_status_history SET estado_nuevo    = 'CREADO'         WHERE estado_nuevo    = 'PENDIENTE';
UPDATE order_status_history SET estado_nuevo    = 'EN_PREPARACION' WHERE estado_nuevo    = 'LISTO_DESPACHO';
UPDATE order_status_history SET estado_nuevo    = 'EN_CAMINO'      WHERE estado_nuevo    = 'EN_RUTA';

CREATE INDEX IF NOT EXISTS idx_products_categoria ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_disponible ON products (disponible);

COMMIT;
