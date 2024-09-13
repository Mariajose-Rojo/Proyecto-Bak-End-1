const express = require('express');
const fs = require('fs');
const router = express.Router();
const filePath = './data/products.json'; // Ruta al archivo json que almacena los productos

// Leo los productos
const readProducts = () => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Guardo productos en el json
const saveProducts = (products) => {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
};

// Ruta para actualizar un producto existente por ID
router.put('/:pid', (req, res) => {
  const pid = req.params.pid; // Obtego el ID del producto con la URL
  const updatedProduct = req.body; // Obtiene los datos actualizados con la solicitud
  const products = readProducts(); // Lee todos los productos del archivo

  const productIndex = products.findIndex(p => p.id === pid); // Buscar el índice del producto a actualizar

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  // Mantengo el ID original del producto y actualizo el resto
  products[productIndex] = { ...products[productIndex], ...updatedProduct, id: pid };

  saveProducts(products); // Guardolos cambios en el json
  res.json({ message: 'Producto actualizado con éxito', product: products[productIndex] });
});

// Ruta para eliminar un producto por ID
router.delete('/:pid', (req, res) => {
  const pid = req.params.pid; // Obtengo el ID del producto con la URL
  const products = readProducts(); 

  const productIndex = products.findIndex(p => p.id === pid); // Busco el indice del producto a eliminar

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  products.splice(productIndex, 1); // Elimino el producto del array
  saveProducts(products); // Guarda los cambios
  res.json({ message: 'Producto eliminado con éxito' });
});

module.exports = router;