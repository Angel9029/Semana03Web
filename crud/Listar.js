const { connectDB } = require('../connection/Connection');

async function listarVentas() {
  const connection = await connectDB();
  try {
    const query = 'select id, cliente, producto, cantidad, precio, total from ventas';
    const [result] = await connection.execute(query);
    return result;
  } catch (err) {
    console.error('Error al insertar venta:', err);
    throw err;
  } finally {
    await connection.end();
  }
}

module.exports = { listarVentas };