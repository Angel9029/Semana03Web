const { connectDB } = require('../connection/Connection');

async function editarVenta(id, datos) {
  const connection = await connectDB();

  try {
    const { cliente, producto, cantidad, precio } = datos;

    const total = parseFloat(cantidad) * parseFloat(precio);

    const query = `
      UPDATE ventas 
      SET cliente = ?, producto = ?, cantidad = ?, precio = ?, total = ?
      WHERE id = ?
    `;

    const [result] = await connection.execute(query, [
      cliente,
      producto,
      cantidad,
      precio,
      total,
      id
    ]);

    // 👇 si no afectó filas, no existe el ID
    if (result.affectedRows === 0) {
      return false;
    }

    return true;

  } catch (err) {
    console.error('Error al editar venta:', err);
    throw err;
  } finally {
    await connection.end();
  }
}

module.exports = { editarVenta };