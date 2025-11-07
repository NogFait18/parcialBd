import express from "express";
import {
  crearCategoria,
  eliminarCategoria,
  mostrarCategorias,
  actualizarCategoria,
  obtenerEstadisticasCategorias,
} from "../controllers/categoriesController.js";

import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

export const categoriesRoutes = express.Router();

// 🌐 RUTA PÚBLICA: listar categorías
categoriesRoutes.get("/", mostrarCategorias);

// 🔒 ADMIN: crear categoría
categoriesRoutes.post("/", verifyToken, isAdmin, crearCategoria);

// 🔒 ADMIN: eliminar categoría
categoriesRoutes.delete("/:id", verifyToken, isAdmin, eliminarCategoria);

// 🔒 ADMIN: actualizar categoría
categoriesRoutes.put("/:id", verifyToken, isAdmin, actualizarCategoria);

// 🔒 ADMIN: estadísticas
categoriesRoutes.get("/stats", verifyToken, isAdmin, obtenerEstadisticasCategorias);
