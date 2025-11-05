import express from "express"
import { actualizarCategoria,crearCategoria,mostrarCategorias,eliminarCategoria,obtenerEstadisticasCategorias } from "../controllers/categoriesController.js"

export const categoriesRoutes = express.Router()

categoriesRoutes.get("",async(req,res)=>{
    try{
        const category = await mostrarCategorias()
        if(category.lenght === 0){
            return res.status(204).json([])
        }
        res.status(200).json(category)
    }catch (err){
        res.status(500).json({mensaje: `Error en el get de categories: ${err}`})
    }
})

categoriesRoutes.post("",async(req,res)=>{
    try{
        const {nombre,descripcion} = req.body
        if(!nombre || !descripcion){
            res.status(400).json({mensaje: `Algunos de los parametros faltan`})
        }
        const newCategory = await crearCategoria(nombre,descripcion)
        res.status(201).json(newCategory)
    }catch (err){
        res.status(500).json({mensaje: `Error al crear una category: ${err}`})
    }
})

categoriesRoutes.delete("/:id",async(req,res)=>{
    try{
        const {id} = req.params
        const categoryDelete = await eliminarCategoria(id)
        if(!categoryDelete){
            res.status(404).json({mensaje: `No se encontro la categoria a eliminar`})
        }
        res.status(200).json ({mensaje: `Se elimino la category correctamente`})
    }catch (err){
        res.status(500).json({mensaje: `Error al eliminar una category: ${err}`})
    }
})

categoriesRoutes.put("/:id",async(req,res)=>{
    try{
        const {id} = req.params
        const {nombre,descripcion} = req.body
        const updateCategory = await actualizarCategoria(
            id,
            {nombre,descripcion},
            {new:true}
        )
        if(!updateCategory){
            res.status(404).json({mensaje: `No se encontro la category a actualizar`})
        }
        res.status(200).json(updateCategory)
    }catch(error){
        res.status(500).json({mensaje: `Error al actualizar la category`})
    }
})

categoriesRoutes.get("/stats",obtenerEstadisticasCategorias)