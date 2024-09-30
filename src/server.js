import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

//configuracion de handlebars
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static('public'));
app.use(express.json());

// almacenar los productos en memoria
let products = [];

// configuarar http y Websockets
const httpServer = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const io = new Server(httpServer);

// ruta vista home con los productos
app.get('/home', (req, res) => {
  res.render('home', { products });
});

// ruta vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products });
});

// websockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // nenviar la lista inicial de productos al conectarse
  socket.emit('updateProducts', products);

  socket.on('newProduct', (product) => {
    products.push(product);

    // emite el evento a todos los clientes para actualizar la lista de productos
    io.emit('updateProducts', products);

    // emite la alerta despues de que se agrega el producto
    io.emit('productAdded', product);
  });
});

// Ruta POST, agrega producto y emite websockstes
app.post('/productos', (req, res) => {
  const newProduct = req.body;

  products.push(newProduct);

  // emite el evento a través de WebSockets
  io.emit('updateProducts', products);
  io.emit('productAdded', newProduct);

  res.json({ message: 'Producto agregado con éxito', product: newProduct });
});
