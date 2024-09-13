const express = require('express');
const fs = require('fs');
const router = express.Router();
const filePath = './data/carts.json'; // Ruta al archivo JSON que almacena los carritos

// Lee carrito desde el JSON
const readCarts = () => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Guarda el carritos en el JSON
const saveCarts = (carts) => {
  fs.writeFileSync(filePath, JSON.stringify(carts, null, 2), 'utf-8');
};

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
  const carts = readCarts(); // Lee todos los carritos del archivo
  const newCart = {
    id: Date.now().toString(), // Generar un ID único para el carrito
    products: [] // Inicia con un array vacío de productos
  };

  carts.push(newCart); // Añade el nuevo carrito al array de carritos
  saveCarts(carts); // Guardalos cambios en el JSON
  res.json({ message: 'Carrito creado con éxito', cart: newCart });
});

module.exports = router;