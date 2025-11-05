// routes/productsRoutes.js
import express from "express"
import { 
  crearProducto, 
  listarProductos, 
  actualizarProducto, 
  eliminarProducto,
  filtrarProductos,
  productosReseniados,
  actualizarStock
} from "../controllers/productController.js"

export const productsRoutes = express.Router()

// GET: obtener todos los productos
productsRoutes.get("/", async (req, res) => {
  try {
    const products = await listarProductos()
    if (products.length === 0) {
      return res.status(204).json([])
    }
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json({ mensaje: `Error en el GET de productos: ${err}` })
  }
})

// POST: crear un producto
productsRoutes.post("/", async (req, res) => {
  try {
    const { nombre, descripcion, stock, categoria,precio, marca} = req.body
    if (!nombre || !descripcion || !stock || !categoria || !marca) {
      return res.status(400).json({ mensaje: "Faltan parámetros" })
    }
    const newProduct = await crearProducto(nombre, descripcion, stock, categoria, marca)
    res.status(201).json(newProduct)
  } catch (error) {
    res.status(500).json({ mensaje: `Error al crear producto: ${error}` })
  }
})

// DELETE: eliminar producto por ID
productsRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const eliminado = await eliminarProducto(id)
    if (!eliminado) {
      return res.status(404).json({ mensaje: "Producto no encontrado" })
    }
    res.status(200).json({ mensaje: "Producto eliminado correctamente" })
  } catch (error) {
    res.status(500).json({ mensaje: `Error al eliminar producto: ${error}` })
  }
})

// PUT: actualizar producto
productsRoutes.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, descripcion, stock, categoria, marca } = req.body
    const actualizado = await actualizarProducto(id, nombre, descripcion, stock, categoria, marca)
    if (!actualizado) {
      return res.status(404).json({ mensaje: "Producto no encontrado" })
    }
    res.status(200).json(actualizado)
  } catch (error) {
    res.status(500).json({ mensaje: `Error al actualizar producto: ${error}` })
  }
})


// GET /api/productos/filtro 
// filtar por precios y marca
productsRoutes.get("/filtro",filtrarProductos)


//GET /api/productos/top 
//obtener los productos más reseñados 

productsRoutes.get("/top",productosReseniados)


//PATCH api/productos/:id/stock 
//actualizar stock

productsRoutes.patch("/:id/stock",actualizarStock)