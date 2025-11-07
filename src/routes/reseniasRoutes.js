import express from "express";
import {
    crearResenia,
    listarResenias,
    reseniasPorProducto,
    promedioCalificaciones,
    eliminarResenia,
    editarResenia
} from "../controllers/reseniasController.js";

export const reseniasRoutes = express.Router();


// requiere token de cliente
reseniasRoutes.post("/", crearResenia);

reseniasRoutes.get("/", listarResenias);

reseniasRoutes.get("/producto/:productId", reseniasPorProducto);

reseniasRoutes.get("/top", promedioCalificaciones);

reseniasRoutes.delete("/:reseniaId", eliminarResenia);

reseniasRoutes.put("/:reseniaId", editarResenia);

