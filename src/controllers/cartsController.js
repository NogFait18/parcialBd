import { Cart } from "../models/carts";

//POST/api/carrito
//para crear un carrito

export const crearCarrito = async (req,res)=>{
    try{
        const {usuarioId} = req.params
        const carritoExistente = await Cart.findOne({usuario:usuarioId})
        if (carritoExistente) {
        return res.status(200).json({ mensaje: "Ya tienes un carrito activo", carrito: carritoExistente });
        }
        const nuevoCarrito = await Cart.create({usuario:usuarioId})
        res.status(201).json(nuevoCarrito);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al crear el carrito: ${error.message}` });
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//GET/api/carrito
//para obtener carrito de un usuario por id
export const obtenerCarrito = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        const carrito = await Cart.findOne({ usuario: usuarioId, estado: "activo" })
        .populate("productos.producto", "nombre precio imagen")
        .populate("usuario", "nombre email");

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
        const { usuarioId, productoId, cantidad } = req.body;

        // Verificar si el producto existe
        const producto = await Product.findById(productoId);
        if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

        // Buscar o crear el carrito activo
        let carrito = await Cart.findOne({ usuario: usuarioId, estado: "activo" });
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

export const actualizarCantidad = async (req, res) => {
    try {
        const { usuarioId, productoId, cantidad } = req.body;

        const carrito = await Cart.findOne({ usuario: usuarioId, estado: "activo" });
        if (!carrito) return res.status(404).json({ mensaje: "Carrito no encontrado" });

        const producto = carrito.productos.find(p => p.producto.toString() === productoId);
        if (!producto) return res.status(404).json({ mensaje: "El producto no está en el carrito" });

        producto.cantidad = cantidad;
        await carrito.save();

        res.status(200).json({ mensaje: "Cantidad actualizada", carrito });
    } catch (error) {
        res.status(500).json({ mensaje: `Error al actualizar cantidad: ${error.message}` });
    }
};


//Eliminar producto del carrito

export const eliminarProducto = async (req, res) => {
    try {
        const { usuarioId, productoId } = req.body;

        const carrito = await Cart.findOne({ usuario: usuarioId, estado: "activo" });
        if (!carrito) return res.status(404).json({ mensaje: "Carrito no encontrado" });

        carrito.productos = carrito.productos.filter(p => p.producto.toString() !== productoId);
        await carrito.save();

        res.status(200).json({ mensaje: "Producto eliminado del carrito", carrito });
    } catch (error) {
        res.status(500).json({ mensaje: `Error al eliminar producto: ${error.message}` });
    }
};

//GET /api/carrito/:usuarioId/total

export const finalizarCarrito = async (req, res) => {
    try {
        const { usuarioId } = req.body;

        // Buscar el carrito activo
        const carrito = await Cart.findOne({ usuario: usuarioId, estado: "activo" }).populate("productos.producto", "nombre precio");
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
