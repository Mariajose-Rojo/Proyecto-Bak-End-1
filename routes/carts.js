import express from 'express';
import fs from 'fs/promises';  // Importo fs.promises
import path from 'path';

const router = express.Router();

const rutaArchivoCarritos = path.join(__dirname, '../data/carritos.json'); // Ruta del archivo de carritos
const rutaArchivoProductos = path.join(__dirname, '../data/productos.json'); // Ruta del archivo de productos

// Funcion para leer el archivo de carritos
const leerArchivoCarritos = async () => {
  try {
    const datos = await fs.readFile(rutaArchivoCarritos, 'utf-8');
    return JSON.parse(datos);
  } catch (error) {
    console.error('Error al leer carritos:', error);
    throw error;
  }
};

// Funcion para escribir en el archivo de carritos
const escribirArchivoCarritos = async (datos) => {
  try {
    await fs.writeFile(rutaArchivoCarritos, JSON.stringify(datos, null, 2));
  } catch (error) {
    console.error('Error al escribir carritos:', error);
    throw error;
  }
};

// Funcion para leer el archivo de productos
const leerArchivoProductos = async () => {
  try {
    const datos = await fs.readFile(rutaArchivoProductos, 'utf-8');
    return JSON.parse(datos);
  } catch (error) {
    console.error('Error al leer productos:', error);
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
    const productos = await leerArchivoProductos();

    const indiceCarrito = carritos.findIndex(c => c.id === cid);

    if (indiceCarrito === -1) {
      return res.status(404).json({ error: 'Carrito no encontrado' }); //404 siempre que no se encuentre un elemento
    }

    const productoExistente = productos.find(p => p.id === pid);
    if (!productoExistente) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const carrito = carritos[indiceCarrito];
    const productoEnCarrito = carrito.productos.find(p => p.producto === pid);

    if (productoEnCarrito) {
      // Incremrnto la cant si el producto ya existe en el carrito
      productoEnCarrito.cantidad += 1;
    } else {
      // agrego el producto al carrito con cant 1 si no existe
      carrito.productos.push({ producto: pid, cantidad: 1 });
    }

    carritos[indiceCarrito] = carrito; // actualizao el carrito
    await escribirArchivoCarritos(carritos); // guardo el archivo

    res.json(carrito); // Devuelve el carritoa actualizado
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

export default router;
