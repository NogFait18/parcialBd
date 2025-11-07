import express from "express";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";
import { 
  crearPedido, 
  listarPedidos, 
  listarPedidosPorUsuario, 
  actualizarEstadoPedido, 
  obtenerEstadisticasPedidos,
  obtenerPedidoPorId,
  eliminarPedido,
  editarPedido
} from "../controllers/pedidosController.js";

export const pedidosRoutes = express.Router();

// 👤 Rutas de usuario (requieren token)
pedidosRoutes.post("/:usuarioId", verifyToken, crearPedido);
pedidosRoutes.get("/user/:userId", verifyToken, listarPedidosPorUsuario);

// 🧮 Solo admin
pedidosRoutes.get("/stats", verifyToken, verifyAdmin, obtenerEstadisticasPedidos);
pedidosRoutes.patch("/:id/status", verifyToken, verifyAdmin, actualizarEstadoPedido);

// 🧩 Otras (pueden ser públicas o protegidas según tu lógica)
pedidosRoutes.get("", verifyToken, verifyAdmin, listarPedidos); // listar todos -> admin
pedidosRoutes.get("/:id", verifyToken, obtenerPedidoPorId);
pedidosRoutes.delete("/:id", verifyToken, verifyAdmin, eliminarPedido);
pedidosRoutes.put("/:id", verifyToken, verifyAdmin, editarPedido);
