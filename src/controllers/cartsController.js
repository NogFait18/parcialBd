import { Cart } from "../models/carts.js";

//POST/api/carrito
//para crear un carrito

export const crearCarrito = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const { productos } = req.body; // recibe un array de productos opcional

        // Verifica si ya existe un carrito
        const carritoExistente = await Cart.findOne({ usuario: usuarioId });
        if (carritoExistente) {
            return res.status(200).json({
                mensaje: "Ya tienes un carrito activo",
                carrito: carritoExistente
            });
        }

        // Crea un nuevo carrito con productos si se pasaron
        const nuevoCarrito = await Cart.create({
            usuario: usuarioId,
            productos: productos || []
        });

        res.status(201).json(nuevoCarrito);

    } catch (error) {
        res.status(500).json({ mensaje: `Error al crear el carrito: ${error.message}` });
    }
};


//------------------------------------------------------------------------------------------------------------------------------------------------
//GET/api/carrito
//para obtener carrito de un usuario por id
// GET /api/carrito/:usuarioId
export const obtenerCarrito = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        // Buscar carrito activo del usuario y popular usuario y productos
        const carrito = await Cart.findOne({ usuario: usuarioId })
            .populate({
                path: "usuario",
                select: "nombre email"
            })
            .populate({
                path: "productos.producto",
                select: "nombre precio"
            });

        if (!carrito) {
            return res.status(404).json({ mensaje: "No se encontró un carrito activo para este usuario" });
        }

        res.status(200).json(carrito);

    } catch (error) {
        res.status(500).json({ mensaje: `Error al obtener el carrito: ${error.message}` });
    }
};

//------------------------------------------------------------------------------------------------------------------------------------------------

export const agregarProducto = async (req, res) => {
    try {
        const {usuarioId} = req.params
        const { productoId, cantidad } = req.body;

        // Verificar si el producto existe
        const producto = await Product.findById(productoId);
        if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

        // Buscar o crear el carrito activo
        let carrito = await Cart.findOne({ usuario: usuarioId});
        if (!carrito) carrito = await Cart.create({ usuario: usuarioId });

        // Buscar si el producto ya está en el carrito
        const productoExistente = carrito.productos.find(p => p.producto.toString() === productoId);

        if (productoExistente) {
        // Si ya está, aumentar cantidad
        productoExistente.cantidad += cantidad;
        } else {
        // Si no está, agregar nuevo
        carrito.productos.push({ producto: productoId, cantidad });
        }

        await carrito.save();
        res.status(200).json({ mensaje: "Producto agregado al carrito", carrito });
    } catch (error) {
        res.status(500).json({ mensaje: `Error al agregar producto: ${error.message}` });
    }
};


//Actualizar cantidad de un producto en el carrito

export const actualizarCarrito = async (req, res) => {
    try {
        const{usuarioId} = req.params
        const { productos } = req.body; // productos = [{producto: id, cantidad: num}, ...]

        const carrito = await Cart.findOne({ usuario: usuarioId});
        if (!carrito) return res.status(404).json({ mensaje: "Carrito no encontrado" });

        // Reemplaza los productos actuales por los nuevos
        carrito.productos = productos.map(p => ({
            producto: p.producto,
            cantidad: p.cantidad
        }));

        await carrito.save();

        // Popular productos y usuario si querés enviar la info completa
        await carrito.populate([
        { path: "usuario", select: "nombre email" },
        { path: "productos.producto", select: "nombre precio" }
        ]);


        res.status(200).json({ mensaje: "Carrito actualizado", carrito });
    } catch (error) {
        res.status(500).json({ mensaje: `Error al actualizar el carrito: ${error.message}` });
    }
};


//eliminar producto del carrito

// Reemplaza eliminarProducto
export const eliminarCarrito = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        // Buscar y eliminar el carrito del usuario
        const carritoEliminado = await Cart.findOneAndDelete({ usuario: usuarioId });

        if (!carritoEliminado) {
            return res.status(404).json({ mensaje: "No se encontró un carrito para eliminar" });
        }

        res.status(200).json({
            mensaje: "Carrito eliminado correctamente",
            carrito: carritoEliminado
        });
    } catch (error) {
        res.status(500).json({ mensaje: `Error al eliminar el carrito: ${error.message}` });
    }
};

//GET /api/carrito/:usuarioId/total

export const finalizarCarrito = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        // Buscar el carrito activo
        const carrito = await Cart.findOne({ usuario: usuarioId}).populate("productos.producto", "nombre precio");
        if (!carrito) return res.status(404).json({ mensaje: "No hay carrito activo" });

        // Calcular el total del carrito
        const total = carrito.productos.reduce((acum, item) => {
        const precio = item.producto?.precio || 0;
        return acum + precio * item.cantidad;
        }, 0);

        // Marcar el carrito como completado y guardar el total
        carrito.estado = "completado";
        carrito.total = total; // guardamos el total si el modelo lo tiene
        await carrito.save();

        res.status(200).json({
        mensaje: "Carrito finalizado con éxito",
        total: total.toFixed(2),
        carrito
        });
    } catch (error) {
        res.status(500).json({ mensaje: `Error al finalizar el carrito: ${error.message}` });
    }
};
