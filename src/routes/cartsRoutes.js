import express from "express";
// requireAuth es la función que verifica el token
import { requireAuth } from "../middleware/authMiddleware.js"; 
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
// CORRECCIÓN: Usamos requireAuth, que es la función que existe.
cartsRoutes.use(requireAuth); 

cartsRoutes.post("/:usuarioId", crearCarrito);
cartsRoutes.delete("/:usuarioId", eliminarCarrito);
cartsRoutes.put("/:usuarioId", actualizarCarrito);
cartsRoutes.post("", agregarProducto);
cartsRoutes.get("/:usuarioId", obtenerCarrito);
cartsRoutes.get("/:usuarioId/total", finalizarCarrito);