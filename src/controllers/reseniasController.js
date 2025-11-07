import { Resenia } from "../models/resenia.js";
import { Pedido } from "../models/pedido.js"; // Necesario para validar la compra
/* import { Product } from "../models/products.js";
import { User } from "../models/users.js"; */

// ====================================================================================
// POST /api/resenas
// Crear reseña solo si el usuario compró el producto.
// ====================================================================================
export const crearResenia = async (req, res) => {
    try {
        const { usuarioId, productoId, calificacion, comentario } = req.body;
        
        // --- 1. Validación de Compra ---
        // Buscamos si existe al menos UNA orden de este usuario que contenga este producto.
        // Usamos $match (comparación) para filtrar.
        const ordenComprada = await Pedido.findOne({
            'usuario': usuarioId,
            'items.producto': productoId
            // Opcional: Podrías añadir "estado: 'Entregado'" si quisieras ser más estricto
        });

        if (!ordenComprada) {
            return res.status(403).json({ 
                success: false, 
                error: 'No autorizado. Debes haber comprado este producto para dejar una reseña.' 
            });
        }
        
        // --- 2. Validar que no haya reseñado antes ---
        const reseñaExistente = await Resenia.findOne({ producto: productoId, usuario: usuarioId });
        if (reseñaExistente) {
            return res.status(400).json({ success: false, error: 'Ya has enviado una reseña para este producto.' });
        }

        // --- 3. Crear y guardar la reseña ---
        const nuevaResenia = new Resenia({
            producto: productoId,
            usuario: usuarioId,
            calificacion,
            comentario
        });

        const reseniaGuardada = await nuevaResenia.save();
        res.status(201).json({ success: true, data: reseniaGuardada });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, error: error.message });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

// ====================================================================================
// GET /api/resenas
// Listar todas las reseñas con datos de usuario y producto.
// ====================================================================================
export const listarResenias = async (req, res) => {
    try {
        // Usamos .populate() para cumplir el requisito (alternativa a $lookup)
        const resenias = await Resenia.find()
            .populate('usuario', 'nombre email') // Trae solo nombre y email del usuario
            .populate('producto', 'nombre'); // Trae solo el nombre del producto

        res.status(200).json({ success: true, data: resenias });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ====================================================================================
// GET /api/resenas/product/:productId
// Reseñas de un producto específico.
// ====================================================================================
export const reseniasPorProducto = async (req, res) => {
    try {
        const { productId } = req.params;
        
        // Usamos $match (implícito en find) para filtrar por ID de producto
        const resenias = await Resenia.find({ producto: productId })
            .populate('usuario', 'nombre')
            .sort({ createdAt: -1 }); // $sort (implícito)

        if (resenias.length === 0) {
            return res.status(200).json({ success: true, data: [], message: "No hay reseñas para este producto." });
        }
        
        res.status(200).json({ success: true, data: resenias });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ====================================================================================
// GET /api/resenas/top
// Promedio de calificaciones por producto.
// ====================================================================================
export const promedioCalificaciones = async (req, res) => {
    try {
        // Pipeline de Agregación
        const stats = await Resenia.aggregate([
            {
                // 1. $group: Agrupar por el ID del producto
                $group: {
                    _id: "$producto", // Agrupa por el campo 'producto'
                    // 2. $avg: Calcular el promedio del campo 'calificacion'
                    promedioCalificacion: { $avg: "$calificacion" },
                    // 3. $sum (o $count): Contar cuántas reseñas tiene cada uno
                    totalResenas: { $sum: 1 } 
                }
            },
            {
                // 4. $sort: Ordenar de mejor promedio a peor
                $sort: { promedioCalificacion: -1 }
            },
            {
                // 5. $lookup: Opcional, para traer el nombre del producto
                $lookup: {
                    from: "products", // Nombre de la colección de Productos
                    localField: "_id",
                    foreignField: "_id",
                    as: "productoInfo"
                }
            },
            {
                // 6. $unwind: Para desenrollar el array de productoInfo
                $unwind: "$productoInfo"
            },
            {
                // 7. $project: Para limpiar la salida
                $project: {
                    _id: 0,
                    productoId: "$_id",
                    nombreProducto: "$productoInfo.nombre",
                    promedioCalificacion: { $round: ["$promedioCalificacion", 1] }, // Redondear a 1 decimal
                    totalResenas: 1
                }
            }
        ]);

        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ====================================================================================
// PUT /api/resenas/:id
// Editar una reseña existente.
// ====================================================================================
export const editarResenia = async (req, res) => {
    try {
        const { reseniaId } = req.params;
        const { calificacion, comentario } = req.body;

        const reseniaEditada = await Resenia.findByIdAndUpdate(
            reseniaId,
            { calificacion, comentario },
            { new: true } // devuelve la reseña actualizada
        );

        if (!reseniaEditada) {
            return res.status(404).json({ success: false, message: "Reseña no encontrada." });
        }

        res.status(200).json({
            success: true,
            message: "Reseña actualizada correctamente.",
            data: reseniaEditada
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al editar la reseña.",
            error: error.message
        });
    }
};
// ====================================================================================
// DELETE /api/resenas/:id
// Eliminar una reseña existente.
// ====================================================================================
export const eliminarResenia = async (req, res) => {
    try {
        const { reseniaId } = req.params;

        const reseniaEliminada = await Resenia.findByIdAndDelete(reseniaId);

        if (!reseniaEliminada) {
            return res.status(404).json({ success: false, message: "Reseña no encontrada." });
        }

        res.status(200).json({
            success: true,
            message: "Reseña eliminada correctamente."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar la reseña.",
            error: error.message
        });
    }
};