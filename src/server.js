import express from 'express';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';

const app = express();
const port = 8080;

//Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

//servidor HTTP junto cxon Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas a usar 
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Rutas para las vistas
app.get('/', (req, res) => {
  res.render('home'); // Renderiza la vista home.handlebars
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts'); // Renderiza la vista realTimeProducts.handlebars
});

// Evento de conexión de Socket.IO
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Aca puedo poner el sweet alert
});

// Iniciar el servidor
httpServer.listen(port, () => {
  console.log(`Listening on PORT ${port}`);
});
