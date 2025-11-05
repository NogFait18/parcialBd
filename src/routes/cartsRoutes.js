import express from "express"
import { actualizarCantidad, agregarProducto, crearCarrito, eliminarProducto, finalizarCarrito, obtenerCarrito } from "../controllers/cartsController"

export const cartsRoutes = express.Router()

cartsRoutes.post("/:usuariosId",crearCarrito)
cartsRoutes.delete("",eliminarProducto)
cartsRoutes.put("",actualizarCantidad)
cartsRoutes.post("",agregarProducto)
cartsRoutes.get("/:usuarioId",obtenerCarrito)
cartsRoutes.get("/:usuarioId/total",finalizarCarrito)