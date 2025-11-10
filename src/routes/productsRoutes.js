import express from "express";
import {
  crearProducto,
  listarProductos,
  actualizarProducto,
  eliminarProducto,
  filtrarProductos,
  productosReseniados,
  actualizarStock
} from "../controllers/productController.js";
import { requireAuth, requireAdmin, requireOwnerOrAdmin } from "../middleware/authMiddleware.js";

export const productsRoutes = express.Router();

// Rutas públicas
productsRoutes.get("/", listarProductos);
productsRoutes.get("/filtro", filtrarProductos);
productsRoutes.get("/top", productosReseniados);

// Rutas protegidas (solo con token)
// Cambio: verificarToken -> requireAuth, verificarAdmin -> requireAdmin
productsRoutes.post("/", requireAuth, requireAdmin, crearProducto);
productsRoutes.delete("/:id", requireAuth, requireAdmin, eliminarProducto);
productsRoutes.put("/:id", requireAuth, requireAdmin, actualizarProducto);
productsRoutes.patch("/:id/stock", requireAuth, requireAdmin, actualizarStock);