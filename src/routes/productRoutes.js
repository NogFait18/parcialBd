import express from "express";

import Product from "../models/products.js";
import Categoria from "../models/Categoria.js"; // esta todavia no existe
import Resena from "../models/Resena.js"; //esta tampoco

export const productRoutes = express.Router();


// POST /api/productos 
// ruta para crear productos y con validación por las dudas
productRoutes.post("/", async (req, res) => {
    try {
        const { nombre, descripcion, categoria, precio, stock, marca } = req.body;

        // Validación de campos faltantes
        if (!nombre || !categoria || !precio || stock === undefined) {
            return res.status(400).json({ mensaje: `Campos obligatorios faltantes: nombre, categoria, precio, stock` });
        }

        // Validación extra: verificar que la categoría exista
        const categoriaExiste = await Categoria.findById(categoria);
        if (!categoriaExiste) {
             return res.status(404).json({ mensaje: 'La categoría especificada no existe' });
        }
        const newProduct = new Product({
            nombre,
            descripcion,
            categoria,
            precio,
            stock,
            marca
        });
        await newProduct.save();
        
        res.status(201).json(newProduct);

    } catch (error) {
        res.status(500).json({ mensaje: `Error en el post de productos: ${error.message}` });
    }
});

// GET /api/productos 
// listar productos con su categoría usando $lookup
productRoutes.get("/", async (req, res) => {
    try {
        const productos = await Product.aggregate([
            {
                $lookup: {
                    from: 'categorias', // acá el nombre de categorias, verificar
                    localField: 'categoria', // campo en 'products'
                    foreignField: '_id',     // campo en 'categorias'
                    as: 'categoriaInfo'  // nombre del nuevo array
                }
            },
            {
                // $unwind para que nos quede un obj
                $unwind: '$categoriaInfo'
            }
        ]);

        if (productos.length === 0) {
            return res.status(204).json([]);
        }
        res.status(200).json(productos);

    } catch (err) {
        res.status(500).json({ mensaje: `Error en el get de productos: ${err.message}` });
    }
});


// GET /api/productos/filtro 
// filtar por precios y marca
productRoutes.get("/filtro", async (req, res) => {
    try {
        const { precioMin, precioMax, marca } = req.query;
        const filtro = {};
        const condiciones = [];

        // Lógica de filtro por precio ($gte, $lte)
        if (precioMin && precioMax) {
            condiciones.push({ precio: { $gte: parseFloat(precioMin), $lte: parseFloat(precioMax) } });
        } else if (precioMin) {
            condiciones.push({ precio: { $gte: parseFloat(precioMin) } });
        } else if (precioMax) {
            condiciones.push({ precio: { $lte: parseFloat(precioMax) } });
        }

        // Lógica de filtro por marca ($regex para Búsqueda 'like' sin mayúsculas)
        if (marca) {
            condiciones.push({ marca: { $regex: new RegExp(marca, 'i') } });
        }

        // Unimos con $and
        if (condiciones.length > 0) {
            filtro.$and = condiciones;
        }

        const productos = await Product.find(filtro).populate('categoria', 'nombre');
        
        if (productos.length === 0) {
            return res.status(204).json([]);
        }
        res.status(200).json(productos);

    } catch (err) {
        res.status(500).json({ mensaje: `Error al filtrar productos: ${err.message}` });
    }
});

// ---
// GET /api/productos/top (Productos más reseñados - $group, $sort)
// ---
productRoutes.get("/top", async (req, res) => {
    try {
        // Esta consulta debe usar el modelo 'Resena'
        const topProductos = await Resena.aggregate([
            // agrupar por producto y contar
            { 
                $group: { 
                    _id: '$producto', 
                    totalResenas: { $sum: 1 } 
                } 
            },
            // orden mayor a menor
            { $sort: { totalResenas: -1 } },
            // unir con 'products' para obtener la info
            {
                $lookup: {
                    from: 'products', // Asegúrate que sea el nombre de tu colección
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productoInfo'
                }
            },
            // desanidar el array
            { $unwind: '$productoInfo' }
        ]);
        
        if (topProductos.length === 0) {
            return res.status(204).json([]);
        }
        res.status(200).json(topProductos);

    } catch (err) {
        res.status(500).json({ mensaje: `Error al obtener top productos: ${err.message}` });
    }
});


// GET /api/productos/:id
//obtener un producto por su ID

productRoutes.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Product.findById(id).populate('categoria', 'nombre'); 

        if (!producto) {
            return res.status(404).json({ mensaje: `No se encontro el producto` });
        }
        res.status(200).json(producto);

    } catch (err) {
        res.status(500).json({ mensaje: `Error al obtener producto: ${err.message}` });
    }
});


// PUT /api/productos/:id 
// actualización 

productRoutes.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, categoria, precio, stock, marca } = req.body;

        const updateProducto = await Product.findByIdAndUpdate(
            id,
            // Objeto con todos los campos a actualizar
            { nombre, descripcion, categoria, precio, stock, marca },
            // Opciones: new:true devuelve el doc actualizado
            { new: true, runValidators: true } 
        );

        if (!updateProducto) {
            return res.status(404).json({ mensaje: `No se encontro el producto a actualizar` });
        }
        res.status(200).json(updateProducto);

    } catch (error) {
        res.status(500).json({ mensaje: `Error al actualizar el producto: ${error.message}` });
    }
});

// PATCH /api/productos/:id/stock 
// actualizar el stock

productRoutes.patch("/:id/stock", async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevoStock } = req.body;

        // Validación
        if (nuevoStock === undefined || isNaN(nuevoStock) || nuevoStock < 0) {
            return res.status(400).json({ mensaje: `El 'nuevoStock' es inválido o faltante` });
        }

        const updateProducto = await Product.findByIdAndUpdate(
            id,
            { $set: { stock: nuevoStock } }, // $set solo actualiza este campo
            { new: true, runValidators: true }
        );

        if (!updateProducto) {
            return res.status(404).json({ mensaje: `No se encontro el producto` });
        }
        res.status(200).json(updateProducto);

    } catch (error) {
        res.status(500).json({ mensaje: `Error al actualizar el stock: ${error.message}` });
    }
});

// DELETE /api/productos/:id
//eliminar el producto
productRoutes.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const productDelete = await Product.findByIdAndDelete(id);
        
        if (!productDelete) {
            return res.status(404).json({ mensaje: `No se encontro el producto a eliminar` });
        }
        res.status(200).json({ mensaje: `Elimino producto correctamente` });

    } catch (error) {
         res.status(500).json({ mensaje: `Error al eliminar el producto: ${error.message}` });
    }
});