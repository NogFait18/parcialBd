import express from "express"
import {  actualizarCarrito, agregarProducto, crearCarrito, eliminarCarrito, finalizarCarrito, obtenerCarrito} from "../controllers/cartsController.js"

export const cartsRoutes = express.Router()

cartsRoutes.post("/:usuarioId",crearCarrito)
cartsRoutes.delete("/:usuarioId",eliminarCarrito)
cartsRoutes.put("/:usuarioId",actualizarCarrito)
cartsRoutes.post("",agregarProducto)
cartsRoutes.get("/:usuarioId",obtenerCarrito)
cartsRoutes.get("/:usuarioId/total",finalizarCarrito)