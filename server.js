const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());

// Importo las rutas
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

// Usar las rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Listening on PORT ${port}`);
});
