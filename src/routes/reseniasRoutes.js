import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  crearResenia,
  listarResenias,
  reseniasPorProducto,
  promedioCalificaciones,
  eliminarResenia,
  editarResenia
} from "../controllers/reseniasController.js";

export const reseniasRoutes = express.Router();

//  Solo crear reseña requiere estar logueado
// Corrección: verifyToken -> requireAuth
reseniasRoutes.post("/", requireAuth, crearResenia);

// públicas
reseniasRoutes.get("/", listarResenias);
reseniasRoutes.get("/producto/:productId", reseniasPorProducto);
reseniasRoutes.get("/top", promedioCalificaciones);

// si querés, eliminar/editar pueden requerir token
// Corrección: verifyToken -> requireAuth
reseniasRoutes.delete("/:reseniaId", requireAuth, eliminarResenia);
// Corrección: verifyToken -> requireAuth
reseniasRoutes.put("/:reseniaId", requireAuth, editarResenia);