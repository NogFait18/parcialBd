import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  crearResenia,
  listarResenias,
  reseniasPorProducto,
  promedioCalificaciones,
  eliminarResenia,
  editarResenia
} from "../controllers/reseniasController.js";

export const reseniasRoutes = express.Router();

// ✅ Solo crear reseña requiere estar logueado
reseniasRoutes.post("/", verifyToken, crearResenia);

// públicas
reseniasRoutes.get("/", listarResenias);
reseniasRoutes.get("/producto/:productId", reseniasPorProducto);
reseniasRoutes.get("/top", promedioCalificaciones);

// si querés, eliminar/editar pueden requerir token
reseniasRoutes.delete("/:reseniaId", verifyToken, eliminarResenia);
reseniasRoutes.put("/:reseniaId", verifyToken, editarResenia);
