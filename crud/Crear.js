const { connectDB } = require('../connection/Connection');

async function insertarVenta(datos) {
  const connection = await connectDB();
  try {
    const { cliente, producto, cantidad, precio } = datos;
    const total = cantidad * precio;
    const query = 'INSERT INTO ventas (cliente, producto, cantidad, precio, total) VALUES (?, ?, ?, ?, ?)';
    const [result] = await connection.execute(query, [cliente, producto, cantidad, precio, total]);
    console.log('Venta insertada con ID:', result.insertId);
    return result.insertId;
  } catch (err) {
    console.error('Error al insertar venta:', err);
    throw err;
  } finally {
    await connection.end();
  }
}

module.exports = { insertarVenta };
