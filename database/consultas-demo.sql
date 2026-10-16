-- Inventario actual
SELECT p.nombre, c.nombre AS categoria, p.precio, p.stock, p.disponible
  FROM products p
  JOIN categories c ON c.id = p.category_id
 ORDER BY c.nombre, p.nombre;

-- Conteo global: se ejecuta antes y despues de la prueba de rollback y debe dar lo mismo
SELECT (SELECT COUNT(*) FROM orders)               AS pedidos,
       (SELECT COUNT(*) FROM order_items)          AS lineas,
       (SELECT COUNT(*) FROM order_status_history) AS historial;

-- Filas huerfanas: las tres columnas deben ser 0
SELECT (SELECT COUNT(*) FROM order_items oi
          LEFT JOIN orders o ON o.id = oi.order_id
         WHERE o.id IS NULL) AS lineas_huerfanas,
       (SELECT COUNT(*) FROM order_status_history h
          LEFT JOIN orders o ON o.id = h.order_id
         WHERE o.id IS NULL) AS historial_huerfano,
       (SELECT COUNT(*) FROM orders o
          LEFT JOIN order_items oi ON oi.order_id = o.id
         WHERE oi.id IS NULL) AS pedidos_sin_lineas;

-- Ultimos pedidos
SELECT id, estado, subtotal, impuesto, total, repartidor_id, created_at
  FROM orders
 ORDER BY created_at DESC
 LIMIT 10;

-- Detalle y recorrido de estados del ultimo pedido
WITH ultimo AS (SELECT id FROM orders ORDER BY created_at DESC LIMIT 1)
SELECT p.nombre, oi.cantidad, oi.precio_unitario, oi.subtotal
  FROM order_items oi
  JOIN products p ON p.id = oi.product_id
 WHERE oi.order_id = (SELECT id FROM ultimo);

WITH ultimo AS (SELECT id FROM orders ORDER BY created_at DESC LIMIT 1)
SELECT estado_anterior, estado_nuevo, changed_at
  FROM order_status_history
 WHERE order_id = (SELECT id FROM ultimo)
 ORDER BY changed_at;
