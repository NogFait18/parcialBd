import { Categories } from "../models/categories.js";
import { Product } from "../models/products.js";

//POST/api/categorias
//para crear una categoria

export const crearCategoria = async(nombre,descripcion)=>{
    const category = new Categories(
        {
            nombre,descripcion
        }
    )
    const newCategory = await category.save()
    return{category:newCategory}
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//DELETE/api/categorias
//para eliminar un categoria por id

export const eliminarCategoria = async (id)=>{
    return await Categories.findByIdAndDelete(id)
}

//------------------------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------------------------------------

//GET/api/categorias
//para mostrar todas las categorias

export const mostrarCategorias = async ()=>{
    return await Categories.find()
}

//------------------------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------------------------------------
//PUT/api/categorias
//para actualizar una categoria por id

export const actualizarCategoria = async(id,data)=>{
    return await Categories.findByIdAndUpdate(
        id,
        data,
        {new:true}
    )
}
//------------------------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------------------------------------
// GET /api/categorias/stats
//cantidad de productos por categoría.
export const obtenerEstadisticasCategorias = async (req, res) => {
    try {
        const stats = await Product.aggregate([
        {
            $group: {
            _id: "$categoria", // agrupa por el campo "categoria" (ObjectId)
            cantidadProductos: { $sum: 1 }
            }
        },
        {
            $lookup: {
            from: "categories", // nombre de la colección (en minúsculas y plural)
            localField: "_id",
            foreignField: "_id",
            as: "categoriaInfo"
            }
        },
        {
            $unwind: "$categoriaInfo" // desanidamos el array devuelto por $lookup
        },
        {
            $project: {
            _id: 0,
            categoria: "$categoriaInfo.nombre",
            cantidadProductos: 1
            }
        }
        ]);

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al obtener estadísticas: ${error}` });
    }
};
//------------------------------------------------------------------------------------------------------------------------------------------------