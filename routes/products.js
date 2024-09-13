const express = require('express');
const fs = require('fs');
const router = express.Router();
const filePath = './data/products.json';

// Helper para leer productos
const readProducts = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo el archivo de productos:', error);
    return [];
  }
};

// Helper para guardar productos
const saveProducts = (products) => {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
};

// Ruta para actualizar un producto existente por ID
router.put('/:pid', (req, res) => {
  const pid = req.params.pid;
  const updatedProduct = req.body;
  const products = readProducts();

  const productIndex = products.findIndex(p => p.id === pid);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  products[productIndex] = { ...products[productIndex], ...updatedProduct, id: pid };
  saveProducts(products);
  res.json({ message: 'Producto actualizado con éxito', product: products[productIndex] });
});

// Ruta para eliminar un producto por ID
router.delete('/:pid', (req, res) => {
  const pid = req.params.pid;
  const products = readProducts();

  const productIndex = products.findIndex(p => p.id === pid);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  products.splice(productIndex, 1);
  saveProducts(products);
  res.json({ message: 'Producto eliminado con éxito' });
});

module.exports = router;
