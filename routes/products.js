import express from 'express';
import fs from 'fs/promises';  // Importo fs.promises
import path from 'path';

const router = express.Router();
const rutaArchivoProductos = path.join(__dirname, '../data/productos.json');  // Ruta al archivo json que almacena los productos

// Funcion para leer los productos
const leerProductos = async () => {
  try {
    const datos = await fs.readFile(rutaArchivoProductos, 'utf-8');
    return JSON.parse(datos);
  } catch (error) {
    console.error('Error al leer productos:', error);
    throw error;
  }
};

// Funcion para guardar productos en el archivo json
const guardarProductos = async (productos) => {
  try {
    await fs.writeFile(rutaArchivoProductos, JSON.stringify(productos, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error al guardar productos:', error);
    throw error;
  }
};

// Ruta PUT,actualiza un producto existente por ID
router.put('/:pid', async (req, res) => {
  const pid = req.params.pid; // obtiene el id de la url
  const productoActualizado = req.body; // obtiene los datos actualizados con la solicitud

  try {
    const productos = await leerProductos(); // lee todos los productos del archivo

    const indiceProducto = productos.findIndex(p => p.id === pid); //busca por su indice al archivo que se debe actualizar

    if (indiceProducto === -1) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Mantener el ID original del producto y actualizar el resto
    productos[indiceProducto] = { ...productos[indiceProducto], ...productoActualizado, id: pid };

    await guardarProductos(productos); // Guardar los cambios en el archivo json
    res.json({ mensaje: 'Producto actualizado con éxito', producto: productos[indiceProducto] });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el producto' });
  }
});

// Ruta DELETE: elimina a un producto por su id
router.delete('/:pid', async (req, res) => {
  const pid = req.params.pid; // obtiene el id 

  try {
    const productos = await leerProductos(); 

    const indiceProducto = productos.findIndex(p => p.id === pid); // busca el indice del prodcuto a eliminar

    if (indiceProducto === -1) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    productos.splice(indiceProducto, 1); // elimina al prosducto del array
    await guardarProductos(productos); // guarda loos cambios en el json
    res.json({ mensaje: 'Producto eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el producto' });
  }
});

export default router;
