import express from "express";
import {
  crearUsuario,
  mostrarUsuario,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  eliminarUsuarioYCarrito,
  login,
} from "../controllers/usersController.js";
import { requireAuth, requireAdmin, requireOwnerOrAdmin } from "../middleware/authMiddleware.js";

export const usersRoutes = express.Router();

// Público
usersRoutes.post("/login", login);
usersRoutes.post("/", crearUsuario); // registro público

// Solo admin
// Reemplazado verificarToken -> requireAuth y verificarAdmin -> requireAdmin
usersRoutes.get("/", requireAuth, requireAdmin, mostrarUsuario); 
usersRoutes.delete("/:id", requireAuth, requireAdmin, eliminarUsuario);
usersRoutes.delete("/:id", requireAuth, requireAdmin, eliminarUsuarioYCarrito);

// Usuario autenticado (Acceso al dueño o a un admin)
// Reemplazado verificarToken -> requireAuth
usersRoutes.get("/:id", requireAuth, obtenerUsuarioPorId);
usersRoutes.put("/:id", requireAuth, actualizarUsuario);