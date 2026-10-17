import { EntornoDePrueba, linea, marca } from './entorno-de-prueba';

interface Conteo {
  stock: number;
  pedidos: number;
}

EntornoDePrueba.ejecutar(async (entorno) => {
  const producto = await entorno.crearProducto(`Ultima unidad ${marca()}`, 1);
  const [clienteA, clienteB] = await Promise.all([
    entorno.nuevoCliente('a'),
    entorno.nuevoCliente('b'),
  ]);

  linea(`Producto "${producto.nombre}" creado con stock = 1`);
  linea('Disparando dos compras simultaneas de la misma unidad...');
  linea();

  const resultados = await Promise.all(
    [
      { etiqueta: 'A', token: clienteA },
      { etiqueta: 'B', token: clienteB },
    ].map(async ({ etiqueta, token }) => ({
      etiqueta,
      respuesta: await entorno.comprar(token, `concurrencia-${etiqueta}`, [
        { productoId: producto.id, cantidad: 1 },
      ]),
    })),
  );

  for (const { etiqueta, respuesta } of resultados) {
    const detalle = respuesta.exito
      ? 'pedido creado'
      : `${respuesta.error?.codigo}: ${respuesta.error?.mensaje}`;
    linea(`  Compra ${etiqueta}  HTTP ${respuesta.http}  ${detalle}`);
  }

  const [conteo] = await entorno.db.query<Conteo[]>(
    `SELECT p.stock,
            (SELECT COUNT(*)::int FROM order_items oi WHERE oi.product_id = p.id) AS pedidos
       FROM products p
      WHERE p.id = $1`,
    [producto.id],
  );

  await entorno.retirarProducto(producto.id);

  const creadas = resultados.filter((r) => r.respuesta.http === 201).length;
  const rechazadas = resultados.filter((r) =>
    [400, 409].includes(r.respuesta.http),
  ).length;
  const correcto =
    creadas === 1 && rechazadas === 1 && conteo.stock === 0 && conteo.pedidos === 1;

  linea();
  linea('Base de datos despues de las dos compras');
  linea(`  stock del producto     ${conteo.stock}   (esperado 0)`);
  linea(`  lineas de pedido       ${conteo.pedidos}   (esperado 1)`);
  linea();
  linea(
    correcto
      ? 'CORRECTO: una compra recibio 201 y la otra fue rechazada sin sobreventa.'
      : 'FALLO: hubo sobreventa o una respuesta inesperada.',
  );

  return correcto;
}).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
