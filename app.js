const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const { insertarVenta } = require('./crud/Crear');
const { listarVentas } = require('./crud/Listar');
const { editarVenta } = require('./crud/Editar');
const { eliminarVenta } = require('./crud/Eliminar');
const { listarVentaPorId } = require('./crud/ListVenta');

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(path.join(__dirname, '/public', 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error interno del servidor');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.method === 'GET' && req.url.startsWith('/form')) {
    fs.readFile(path.join(__dirname, '/public', 'form.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error interno del servidor');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.method === 'GET' && req.url === '/lista') {
    fs.readFile(path.join(__dirname, '/public', 'lista.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error interno del servidor');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.method === 'GET' && req.url.startsWith('/assets/')) {
    const filePath = path.join(__dirname, 'public', req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('No encontrado');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(data);
    });
  } else if (req.method === 'POST' && req.url === '/api/crear') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const datos = querystring.parse(body);
      try {
        const id = await insertarVenta({
          cliente: datos.cliente,
          producto: datos.producto,
          cantidad: parseInt(datos.cantidad),
          precio: parseFloat(datos.precio)
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, id }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Error al insertar venta' }));
      }
    });
  } else if (req.method === 'GET' && req.url === '/api/listar') {
    try {
      const ventas = await listarVentas();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(ventas));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Error al listar ventas' }));
    }
  } else if (req.method === 'GET' && req.url.startsWith('/api/venta/')) {
    try {
      const id = req.url.split('/').pop();

      const venta = await listarVentaPorId(id);

      if (!venta) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, message: 'No existe' }));
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: venta }));

    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Error al obtener venta' }));
    }
  }
  else if (req.method === 'PUT' && req.url.startsWith('/api/venta/')) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const datos = querystring.parse(body);

      // 👇 obtener ID desde la URL
      const id = req.url.split('/').pop();

      try {
        const actualizado = await editarVenta(id, datos);

        if (!actualizado) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, message: 'No existe' }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));

      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Error al editar venta' }));
      }
    });
  } else if (req.method === 'DELETE' && req.url === '/api/eliminar') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const datos = querystring.parse(body);
      try {
        await eliminarVenta(datos.id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Error al eliminar venta' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Página no encontrada');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});