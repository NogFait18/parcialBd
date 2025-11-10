import { Categories } from "../models/categories.js";
import { Product } from "../models/products.js";

// GET /api/categorias → Listar todas las categorías (público)
export const mostrarCategorias = async (req, res) => {
  try {
    const categories = await Categories.find();
    if (categories.length === 0) {
      return res.status(204).json([]);
    }
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ mensaje: `Error al obtener categorías: ${err.message}` });
  }
};

// POST /api/categorias → Crear una nueva categoría (solo admin)
export const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
      return res.status(400).json({ mensaje: "Faltan campos requeridos." });
    }

    const category = new Categories({ nombre, descripcion });
    const newCategory = await category.save();

    res.status(201).json({ mensaje: "Categoría creada con éxito", category: newCategory });
  } catch (err) {
    res.status(500).json({ mensaje: `Error al crear categoría: ${err.message}` });
  }
};

// PUT /api/categorias/:id → Actualizar categoría (solo admin)
export const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const updated = await Categories.findByIdAndUpdate(
      id,
      { nombre, descripcion },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    res.status(200).json({ mensaje: "Categoría actualizada", categoria: updated });
  } catch (error) {
    res.status(500).json({ mensaje: `Error al actualizar categoría: ${error.message}` });
  }
};

// DELETE /api/categorias/:id → Eliminar categoría (solo admin)
export const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Categories.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    res.status(200).json({ mensaje: "Categoría eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ mensaje: `Error al eliminar categoría: ${err.message}` });
  }
};

// GET /api/categorias/stats → Estadísticas de productos por categoría (solo admin)
export const obtenerEstadisticasCategorias = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$categoria",
          cantidadProductos: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoriaInfo",
        },
      },
      { $unwind: "$categoriaInfo" },
      {
        $project: {
          _id: 0,
          categoria: "$categoriaInfo.nombre",
          cantidadProductos: 1,
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ mensaje: `Error al obtener estadísticas: ${error.message}` });
  }
};
