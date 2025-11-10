import express from "express";
import { requireAuth, requireAdmin, requireOwnerOrAdmin } from "../middleware/authMiddleware.js";
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

// Rutas de usuario (requieren token)
// Corrección: verifyToken -> requireAuth
pedidosRoutes.post("/:usuarioId", requireAuth, crearPedido);
pedidosRoutes.get("/user/:userId", requireAuth, listarPedidosPorUsuario);

// Solo admin
// Corrección: verifyToken -> requireAuth, verifyAdmin -> requireAdmin
pedidosRoutes.get("/stats", requireAuth, requireAdmin, obtenerEstadisticasPedidos);
pedidosRoutes.patch("/:id/status", requireAuth, requireAdmin, actualizarEstadoPedido);

// Otras (pueden ser públicas o protegidas según tu lógica)
// Corrección: verifyToken -> requireAuth, verifyAdmin -> requireAdmin
pedidosRoutes.get("", requireAuth, requireAdmin, listarPedidos); // listar todos -> admin
pedidosRoutes.get("/:id", requireAuth, obtenerPedidoPorId); // Corrección: verifyToken -> requireAuth
pedidosRoutes.delete("/:id", requireAuth, requireAdmin, eliminarPedido); // Corrección: verifyToken -> requireAuth, verifyAdmin -> requireAdmin
pedidosRoutes.put("/:id", requireAuth, requireAdmin, editarPedido); // Corrección: verifyToken -> requireAuth, verifyAdmin -> requireAdmin