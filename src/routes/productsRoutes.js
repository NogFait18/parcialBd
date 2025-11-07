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
import { verificarToken, verificarAdmin } from "../middlewares/authMiddleware.js";

export const productsRoutes = express.Router();

// Rutas públicas
productsRoutes.get("/", listarProductos);
productsRoutes.get("/filtro", filtrarProductos);
productsRoutes.get("/top", productosReseniados);

// Rutas protegidas (solo con token)
productsRoutes.post("/", verificarToken, verificarAdmin, crearProducto);
productsRoutes.delete("/:id", verificarToken, verificarAdmin, eliminarProducto);
productsRoutes.put("/:id", verificarToken, verificarAdmin, actualizarProducto);
productsRoutes.patch("/:id/stock", verificarToken, verificarAdmin, actualizarStock);
