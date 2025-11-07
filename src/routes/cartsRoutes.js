import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { 
  actualizarCarrito, 
  agregarProducto, 
  crearCarrito, 
  eliminarCarrito, 
  finalizarCarrito, 
  obtenerCarrito 
} from "../controllers/cartsController.js";

export const cartsRoutes = express.Router();

// Todas las rutas del carrito requieren token
cartsRoutes.use(verifyToken);

cartsRoutes.post("/:usuarioId", crearCarrito);
cartsRoutes.delete("/:usuarioId", eliminarCarrito);
cartsRoutes.put("/:usuarioId", actualizarCarrito);
cartsRoutes.post("", agregarProducto);
cartsRoutes.get("/:usuarioId", obtenerCarrito);
cartsRoutes.get("/:usuarioId/total", finalizarCarrito);
