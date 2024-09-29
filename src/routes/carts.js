// src/routes/cart.js
import express from 'express';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

// Configuración de __dirname y __filename para módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const rutaArchivoCarritos = path.join(__dirname, '../data/cart.json'); // Asegúrate de que el archivo cart.json existe
const rutaArchivoProductos = path.join(__dirname, '../data/products.json'); // Asegúrate de que el archivo products.json existe

// Función para leer el archivo de carritos
const leerArchivoCarritos = async () => {
  try {
    const datos = await fs.readFile(rutaArchivoCarritos, 'utf-8');
    return JSON.parse(datos);
  } catch (error) {
    console.error('Error al leer carritos:', error);
    throw error;
  }
};

// Función para escribir en el archivo de carritos
const escribirArchivoCarritos = async (datos) => {
  try {
    await fs.writeFile(rutaArchivoCarritos, JSON.stringify(datos, null, 2));
  } catch (error) {
    console.error('Error al escribir carritos:', error);
    throw error;
  }
};

// Ruta GET
router.get('/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const carritos = await leerArchivoCarritos();
    const carrito = carritos.find(c => c.id === cid);

    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(carrito.productos); // Envia los productos del carrito que se encontraron
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos del carrito' });
  }
});

// Ruta POST: agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const carritos = await leerArchivoCarritos();
    const productos = await fs.readFile(rutaArchivoProductos, 'utf-8').then(JSON.parse);

    const indiceCarrito = carritos.findIndex(c => c.id === cid);

    if (indiceCarrito === -1) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const productoExistente = productos.find(p => p.id === pid);
    if (!productoExistente) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const carrito = carritos[indiceCarrito];
    const productoEnCarrito = carrito.productos.find(p => p.producto === pid);

    if (productoEnCarrito) {
      productoEnCarrito.cantidad += 1;
    } else {
      carrito.productos.push({ producto: pid, cantidad: 1 });
    }

    carritos[indiceCarrito] = carrito;
    await escribirArchivoCarritos(carritos);

    res.json(carrito);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

export default router;
