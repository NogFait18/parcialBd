import express from "express";
import {
  crearCategoria,
  eliminarCategoria,
  mostrarCategorias,
  actualizarCategoria,
  obtenerEstadisticasCategorias,
} from "../controllers/categoriesController.js";

import { requireAuth, requireAdmin, requireOwnerOrAdmin } from "../middleware/authMiddleware.js";

export const categoriesRoutes = express.Router();

// RUTA PÚBLICA: listar categorías
categoriesRoutes.get("/", mostrarCategorias);

// ADMIN: crear categoría
// Corrección: verifyToken -> requireAuth, isAdmin -> requireAdmin
categoriesRoutes.post("/", requireAuth, requireAdmin, crearCategoria);

// ADMIN: eliminar categoría
// Corrección: verifyToken -> requireAuth, isAdmin -> requireAdmin
categoriesRoutes.delete("/:id", requireAuth, requireAdmin, eliminarCategoria);

// ADMIN: actualizar categoría
// Corrección: verifyToken -> requireAuth, isAdmin -> requireAdmin
categoriesRoutes.put("/:id", requireAuth, requireAdmin, actualizarCategoria);

// ADMIN: estadísticas
// Corrección: verifyToken -> requireAuth, isAdmin -> requireAdmin
categoriesRoutes.get("/stats", requireAuth, requireAdmin, obtenerEstadisticasCategorias);