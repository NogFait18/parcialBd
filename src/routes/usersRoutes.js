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
import { verificarToken, verificarAdmin } from "../middlewares/authMiddleware.js";

export const usersRoutes = express.Router();

// 🔓 Público
usersRoutes.post("/login", login);
usersRoutes.post("/", crearUsuario); // registro público

// 🔐 Solo admin
usersRoutes.get("/", verificarToken, verificarAdmin, mostrarUsuario);
usersRoutes.delete("/:id", verificarToken, verificarAdmin, eliminarUsuario);
usersRoutes.delete("/:id", verificarToken, verificarAdmin, eliminarUsuarioYCarrito);

// 🔐 Usuario autenticado
usersRoutes.get("/:id", verificarToken, obtenerUsuarioPorId);
usersRoutes.put("/:id", verificarToken, actualizarUsuario);
