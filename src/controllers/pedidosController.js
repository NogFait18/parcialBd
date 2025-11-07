import { Pedido} from "../models/pedido.js"; 
import { Cart } from "../models/carts.js"; 
import { Product } from "../models/products.js"; 

// POST /api/ordenes
export const crearPedido = async (req, res) => {
    try {
        const {usuarioId} = req.params
        const {metodoPago, direccionEnvio } = req.body;
        if (!usuarioId || !metodoPago || !direccionEnvio) {
            return res.status(400).json({ success: false, error: 'Faltan campos obligatorios.' });
        }

        const carrito = await Cart.findOne({ usuario: usuarioId });
        if (!carrito || carrito.productos.length === 0) {
            return res.status(404).json({ success: false, error: "Carrito vacío." });
        }

        let totalPedido = 0;
        const itemsDePedido = [];
        
        for (const item of carrito.productos) {
            const productoInfo = await Product.findById(item.producto).select('nombre precio stock');
            if (!productoInfo) return res.status(404).json({ success: false, error: `Producto no encontrado: ${item.producto}` });
            if (productoInfo.stock < item.cantidad) return res.status(400).json({ success: false, error: `Stock insuficiente para ${productoInfo.nombre}.` });

            const subtotalItem = productoInfo.precio * item.cantidad;
            totalPedido += subtotalItem;

            itemsDePedido.push({
                producto: item.producto,
                nombreProducto: productoInfo.nombre,
                cantidad: item.cantidad,
                precioUnitario: productoInfo.precio,
                subtotalItem: subtotalItem
            });
            
            // Actualizar stock
            await Product.findByIdAndUpdate(item.producto, { $inc: { stock: -item.cantidad } });
        }

        const nuevoPedido = new pedido({ 
            usuario: usuarioId,
            items: itemsDePedido,
            total: totalPedido,
            metodoPago: metodoPago,
            direccionEnvio: direccionEnvio
        });

        const pedidoGuardado = await nuevoPedido.save();
        await Cart.findByIdAndUpdate(carrito._id, { $set: { productos: [] } }); // Vaciar carrito
        res.status(201).json({ success: true, message: "Pedido creado.", data: pedidoGuardado });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error al crear el pedido." });
    }
};

// GET /api/ordenes
export const listarPedidos = async (req, res) => {
    try {
        const pedidos = await pedido.aggregate([ 
            { $lookup: { from: 'users', localField: 'usuario', foreignField: '_id', as: 'usuarioInfo' } },
            { $unwind: '$usuarioInfo' },
            { $project: { _id: 1, fechaPedido: 1, estado: 1, total: 1, metodoPago: 1, items: 1, usuarioNombre: '$usuarioInfo.nombre', usuarioEmail: '$usuarioInfo.email', direccionEnvio: 1 } },
            { $sort: { fechaPedido: -1 } }
        ]);
        res.status(200).json({ success: true, data: pedidos });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error al listar pedidos." });
    }
};

// GET /api/ordenes/user/:userId
export const listarPedidosPorUsuario = async (req, res) => {
    try {
        const { userId } = req.params;
        const pedidos = await pedido.find({ usuario: userId }) // <-- USAMOS MODELO NUEVO
            .populate('usuario', 'nombre email')
            .sort({ fechaPedido: -1 });
        if (pedidos.length === 0) return res.status(404).json({ success: false, message: "No se encontraron pedidos." });
        res.status(200).json({ success: true, data: pedidos });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error al obtener pedidos." });
    }
};

// PATCH /api/ordenes/:id/status
export const actualizarEstadoPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevoEstado } = req.body;
        if (!nuevoEstado) return res.status(400).json({ success: false, error: 'El campo nuevoEstado es obligatorio.' });
        
        const pedidoActualizado = await pedido.findByIdAndUpdate( // <-- USAMOS MODELO NUEVO
            id,
            { $set: { estado: nuevoEstado } },
            { new: true, runValidators: true }
        );
        if (!pedidoActualizado) return res.status(404).json({ success: false, message: "Pedido no encontrado." });
        res.status(200).json({ success: true, message: "Estado actualizado.", data: pedidoActualizado });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error al actualizar estado." });
    }
};

// GET /api/ordenes/stats
export const obtenerEstadisticasPedidos = async (req, res) => {
    try {
        const stats = await pedido.aggregate([ // <-- USAMOS MODELO NUEVO
            { $group: { _id: "$estado", totalPedidos: { $count: {} } } },
            { $sort: { totalPedidos: -1 } }
        ]);
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error al obtener estadísticas." });
    }
};

// GET /api/ordenes/:id
export const obtenerPedidoPorId = async (req, res) => {
    try {
        const pedido = await pedido.findById(req.params.id) // <-- USAMOS MODELO NUEVO
            .populate('usuario', 'nombre email')
            .populate('items.producto', 'nombre precio');
        if (!pedido) return res.status(404).json({ success: false, message: "Pedido no encontrado." });
        res.status(200).json({ success: true, data: pedido });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error al obtener pedido." });
    }
};

// DELETE /api/ordenes/:id
export const eliminarPedido = async (req, res) => {
    try {
        const pedidoEliminado = await pedido.findByIdAndDelete(req.params.id); // <-- USAMOS MODELO NUEVO
        if (!pedidoEliminado) return res.status(404).json({ success: false, message: "Pedido no encontrado." });
        res.status(200).json({ success: true, message: "Pedido eliminado." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error al eliminar pedido." });
    }
};

export const editarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { items, metodoPago, direccionEnvio, estado } = req.body;

        const pedidoEditado = await Pedido.findByIdAndUpdate(
            id,
            {
                ...(items && { items }),
                ...(metodoPago && { metodoPago }),
                ...(direccionEnvio && { direccionEnvio }),
                ...(estado && { estado }),
                actualizadoEn: new Date()
            },
            { new: true }
        )
        .populate("usuario", "nombre email")
        .populate("items.producto", "nombre precio");

        if (!pedidoEditado) {
            return res.status(404).json({ success: false, message: "Pedido no encontrado." });
        }

        res.status(200).json({ success: true, message: "Pedido actualizado correctamente.", pedido: pedidoEditado });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error al editar pedido." });
    }
};
