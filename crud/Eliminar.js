const { connectDB } = require('../connection/Connection');

async function eliminarVenta(id) {
  const connection = await connectDB();

  try {
    const query = 'DELETE FROM ventas WHERE id = ?';
    const [result] = await connection.execute(query, [id]);

    if (result.affectedRows === 0) {
      return false; // no existe
    }

    return true;

  } catch (err) {
    console.error('Error al eliminar venta:', err);
    throw err;
  } finally {
    await connection.end();
  }
}

module.exports = { eliminarVenta };