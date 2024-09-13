const express = require('express');
const router = express.Router();
const fs = require('fs');

const productsFilePath = './data/products.json'; // Ruta al archivo donde se almacenan los productos

// Leo los productos
const readProducts = () => {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Escribe los productos al archivo
const writeProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Ruta raíz GET / - Lista a todos los productos (con un limite)
router.get('/', (req, res) => {
  const { limit } = req.query;
  let products = readProducts();

  if (limit) {
    products = products.slice(0, Number(limit));
  }

  res.json(products);
});

// Ruta GET /:pid - Trae producto por ID
router.get('/:pid', (req, res) => {
  const products = readProducts();
  const product = products.find((p) => p.id === req.params.pid);

  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  res.json(product);
});

// Ruta raíz POST / - Agrega un  nuevo producto
router.post('/', (req, res) => {
  const { title, description, code, price, stock, category, thumbnails = [] } = req.body;

  // Valido los campos que me piden 
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios, excepto thumbnails' });
  }

  const products = readProducts();

  // Genero el id unico
  const newId = products.length > 0 ? Math.max(...products.map((p) => parseInt(p.id, 10))) + 1 : 1;

  const newProduct = {
    id: newId.toString(),
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails,
  };

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
});

module.exports = router;