import express from "express";
import {
    crearResenia,
    listarResenias,
    reseniasPorProducto,
    promedioCalificaciones
} from "../controllers/reseniasController.js";

export const reseniasRoutes = express.Router();


// requiere token de cliente
reseniasRoutes.post("/", crearResenia);

reseniasRoutes.get("/", listarResenias);

reseniasRoutes.get("/product/:productId", reseniasPorProducto);

reseniasRoutes.get("/top", promedioCalificaciones);

