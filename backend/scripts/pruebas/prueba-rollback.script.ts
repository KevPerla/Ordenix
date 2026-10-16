import type { DataSource } from 'typeorm';
import { EntornoDePrueba, linea, marca } from './entorno-de-prueba';

interface Fotografia {
  stock_a: number;
  stock_b: number;
  pedidos: number;
  lineas: number;
  historial: number;
  lineas_huerfanas: number;
  historial_huerfano: number;
}

function fotografiar(
  db: DataSource,
  productoA: string,
  productoB: string,
): Promise<Fotografia> {
  return db
    .query<Fotografia[]>(
      `SELECT
         (SELECT stock FROM products WHERE id = $1) AS stock_a,
         (SELECT stock FROM products WHERE id = $2) AS stock_b,
         (SELECT COUNT(*)::int FROM orders) AS pedidos,
         (SELECT COUNT(*)::int FROM order_items) AS lineas,
         (SELECT COUNT(*)::int FROM order_status_history) AS historial,
         (SELECT COUNT(*)::int FROM order_items oi
            LEFT JOIN orders o ON o.id = oi.order_id
           WHERE o.id IS NULL) AS lineas_huerfanas,
         (SELECT COUNT(*)::int FROM order_status_history h
            LEFT JOIN orders o ON o.id = h.order_id
           WHERE o.id IS NULL) AS historial_huerfano`,
      [productoA, productoB],
    )
    .then(([fila]) => fila);
}

EntornoDePrueba.ejecutar(async (entorno) => {
  const sufijo = marca();
  const productoA = await entorno.crearProducto(`Rollback A ${sufijo}`, 10);
  const productoB = await entorno.crearProducto(`Rollback B ${sufijo}`, 1);
  const cliente = await entorno.nuevoCliente('rollback');

  const antes = await fotografiar(entorno.db, productoA.id, productoB.id);

  linea('Pedido con dos lineas: 3 unidades de A (hay 10) y 5 de B (hay 1).');
  linea('El stock de A se descuenta primero; la linea B falla dentro de la misma transaccion.');
  linea();

  const respuesta = await entorno.comprar(cliente, 'prueba-rollback', [
    { productoId: productoA.id, cantidad: 3 },
    { productoId: productoB.id, cantidad: 5 },
  ]);

  linea(
    `  Respuesta  HTTP ${respuesta.http}  ${respuesta.error?.codigo ?? ''}: ${respuesta.error?.mensaje ?? ''}`,
  );

  const despues = await fotografiar(entorno.db, productoA.id, productoB.id);

  await Promise.all([
    entorno.retirarProducto(productoA.id),
    entorno.retirarProducto(productoB.id),
  ]);

  linea();
  linea('Base de datos                antes  despues');

  const campos: [string, keyof Fotografia][] = [
    ['stock de A', 'stock_a'],
    ['stock de B', 'stock_b'],
    ['pedidos', 'pedidos'],
    ['lineas de pedido', 'lineas'],
    ['historial de estados', 'historial'],
    ['lineas huerfanas', 'lineas_huerfanas'],
    ['historial huerfano', 'historial_huerfano'],
  ];

  for (const [etiqueta, campo] of campos) {
    const igual = antes[campo] === despues[campo];
    linea(
      `  ${etiqueta.padEnd(26)} ${String(antes[campo]).padStart(5)}  ${String(despues[campo]).padStart(7)}  ${igual ? 'sin cambio' : 'ALTERADO'}`,
    );
  }

  const correcto =
    !respuesta.exito &&
    campos.every(([, campo]) => antes[campo] === despues[campo]) &&
    despues.lineas_huerfanas === 0 &&
    despues.historial_huerfano === 0;

  linea();
  linea(
    correcto
      ? 'CORRECTO: ROLLBACK completo, el stock no cambio y no quedaron filas huerfanas.'
      : 'FALLO: la transaccion dejo rastro en la base de datos.',
  );

  return correcto;
}).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
