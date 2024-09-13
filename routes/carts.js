const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const cartFilePath = path.join(__dirname, '../data/carts.json');
const productFilePath = path.join(__dirname, '../data/products.json');

// Helper para leer el archivo de carritos usando promesas
const readCartsFile = () => {
  try {
    const data = fs.readFileSync(cartFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo el archivo de carritos:', error);
    return [];
  }
};

// Helper para escribir en el archivo de carritos
const writeCartsFile = (data) => {
  fs.writeFileSync(cartFilePath, JSON.stringify(data, null, 2));
};

// Helper para leer el archivo de productos
const readProductsFile = () => {
  try {
    const data = fs.readFileSync(productFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo el archivo de productos:', error);
    return [];
  }
};

// Ruta GET - lista de los productos
router.get('/:cid', (req, res) => {
  const carts = readCartsFile();
  const { cid } = req.params;
  const cart = carts.find((c) => c.id === cid);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  res.json(cart.products);
});

// Ruta POST, agrega un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
  const carts = readCartsFile();
  const products = readProductsFile();
  const { cid, pid } = req.params;

  const cartIndex = carts.findIndex((c) => c.id === cid);

  if (cartIndex === -1) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const productExists = products.find((p) => p.id === pid);
  if (!productExists) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const cart = carts[cartIndex];
  const productInCart = cart.products.find((p) => p.product === pid);

  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  writeCartsFile(carts);
  res.json(cart);
});

module.exports = router;
