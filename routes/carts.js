const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const cartFilePath = path.join(__dirname, '../data/carts.json'); // Ruta del archivo de carritos
const productFilePath = path.join(__dirname, '../data/products.json'); // Ruta del archivo de productos

// Helper para leer el archivo de carritos
const readCartsFile = () => {
  const data = fs.readFileSync(cartFilePath, 'utf-8');
  return JSON.parse(data);
};

// Helper para escribir en el archivo de carritos
const writeCartsFile = (data) => {
  fs.writeFileSync(cartFilePath, JSON.stringify(data, null, 2));
};

// Helper para leer el archivo de productos
const readProductsFile = () => {
  const data = fs.readFileSync(productFilePath, 'utf-8');
  return JSON.parse(data);
};

// Ruta GET - lista de los productos
router.get('/:cid', (req, res) => {
  const carts = readCartsFile();
  const { cid } = req.params;
  const cart = carts.find((c) => c.id === cid);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  res.json(cart.products); // envia los productos del carrito que se encontaron
});

// Ruta POST, agrega un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
  const carts = readCartsFile();
  const products = readProductsFile();
  const { cid, pid } = req.params;

  // busca el carrito por ID
  const cartIndex = carts.findIndex((c) => c.id === cid);

  if (cartIndex === -1) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  // Verificar si el producto existe
  const productExists = products.find((p) => p.id === pid);
  if (!productExists) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const cart = carts[cartIndex];
  const productInCart = cart.products.find((p) => p.product === pid);

  if (productInCart) {
    // Incrementar la cantidad si el producto ya existe en el carrito
    productInCart.quantity += 1;
  } else {
    // Agregar el producto al carrito con cantidad 1 si no existe
    cart.products.push({ product: pid, quantity: 1 });
  }

  carts[cartIndex] = cart; // Actualiza el carrito en la lista
  writeCartsFile(carts); // Guarda el archivo de carritos

  res.json(cart); // Devuelve el carro actualizado
});

module.exports = router;