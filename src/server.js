import express from 'express';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars'; 
import path from 'path';
import { fileURLToPath } from 'url'; 

const app = express();
const port = 8080;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// configuarcion de handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static('public'));
app.use(express.json());

//para almacenar productos en memoria
let products = [];

// configurar HTTP y Websockets
const httpServer = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const io = new Server(httpServer);

// Ruta para la vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products });
});

// webSockets
io.on('connection', (socket) => {
  console.log('New client connected');

  // envia la lista inicial de productos al conectarse
  socket.emit('updateProducts', products);

  // cuando se agrega un nuevo producto
  socket.on('newProduct', (product) => {
    products.push(product);

    // .emit= evento A TODOS los clientes para actualizar la lista de productos
    io.emit('updateProducts', products);

    // alerta despues de que se agrega el producto
    io.emit('productAdded', product);
  });
});
