// src/routes/products.js
import express from 'express';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const rutaArchivoProductos = path.join(__dirname, '../data/products.json');

// Función para leer los productos
const leerProductos = async () => {
  try {
    const datos = await fs.readFile(rutaArchivoProductos, 'utf-8');
    return JSON.parse(datos);
  } catch (error) {
    console.error('Error al leer productos:', error);
    throw error;
  }
};

// Función para guardar productos
const guardarProductos = async (productos) => {
  try {
    await fs.writeFile(rutaArchivoProductos, JSON.stringify(productos, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error al guardar productos:', error);
    throw error;
  }
};

// Ruta PUT para actualizar un producto por ID
router.put('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const productoActualizado = req.body;

  try {
    const productos = await leerProductos();
    const indiceProducto = productos.findIndex(p => p.id === pid);

    if (indiceProducto === -1) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    productos[indiceProducto] = { ...productos[indiceProducto], ...productoActualizado, id: pid };

    await guardarProductos(productos);
    res.json({ mensaje: 'Producto actualizado con éxito', producto: productos[indiceProducto] });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el producto' });
  }
});

// Ruta DELETE para eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
  const pid = req.params.pid;

  try {
    const productos = await leerProductos();
    const indiceProducto = productos.findIndex(p => p.id === pid);

    if (indiceProducto === -1) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    productos.splice(indiceProducto, 1);
    await guardarProductos(productos);
    res.json({ mensaje: 'Producto eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el producto' });
  }
});

export default router;
