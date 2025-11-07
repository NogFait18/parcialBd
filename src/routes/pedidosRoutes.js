import express from "express";
// Importamos el controlador en español
import { 
    crearPedido, 
    listarPedidos, 
    listarPedidosPorUsuario, 
    actualizarEstadoPedido, 
    obtenerEstadisticasPedidos,
    obtenerPedidoPorId,
    eliminarPedido
} from "../controllers/pedidosController.js";

// const verifyToken = (req, res, next) => { ... };
// const isAdmin = (req, res, next) => { ... };
// const isOwnerOrAdmin = (req, res, next) => { ... };

export const pedidosRoutes = express.Router();

pedidosRoutes.post("/", crearPedido); 
pedidosRoutes.get("/", listarPedidos); 
pedidosRoutes.get("/stats", obtenerEstadisticasPedidos); 
pedidosRoutes.get("/user/:userId", listarPedidosPorUsuario); 
pedidosRoutes.get("/:id", obtenerPedidoPorId); 
pedidosRoutes.patch("/:id/status", actualizarEstadoPedido); 
pedidosRoutes.delete("/:id", eliminarPedido); 