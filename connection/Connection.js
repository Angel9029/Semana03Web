const mysql = require('mysql2/promise');

const connectionConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "ventas_db",
  port: 3306
};

async function connectDB() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log('Conectado a la base de datos ventas_db');
    return connection;
  } catch (err) {
    console.error('Error al conectar:', err);
    throw err;
  }
}

module.exports = { connectDB };
