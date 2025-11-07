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


productsRoutes.get("/", listarProductos); 

productsRoutes.post("/", crearProducto);

productsRoutes.delete("/:id", eliminarProducto); 

productsRoutes.put("/:id", actualizarProducto); 

productsRoutes.get("/filtro", filtrarProductos);

productsRoutes.get("/top", productosReseniados);

productsRoutes.patch("/:id/stock", actualizarStock);