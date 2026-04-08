const { connectDB } = require('../connection/Connection');

async function listarVentaPorId(id) {
  const connection = await connectDB();
  try {
    const query = 'SELECT id, cliente, producto, cantidad, precio, total FROM ventas WHERE id = ?';
    const [rows] = await connection.execute(query, [id]);

    if (rows.length === 0) {
      return null; // 👈 importante
    }

    return rows[0];
  } catch (err) {
    console.error('Error al obtener venta:', err);
    throw err;
  } finally {
    await connection.end();
  }
}

module.exports = { listarVentaPorId };