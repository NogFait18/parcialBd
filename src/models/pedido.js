import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const itemPedidoSchema = new Schema({
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Product', // Se refiere al modelo 'Product' 
        required: true
    },
    nombreProducto: { type: String, required: true, trim: true },
    cantidad: { type: Number, required: true, min: [1, 'La cantidad debe ser al menos 1.'] },
    precioUnitario: { type: Number, required: true, min: [0, 'El precio no puede ser negativo.'] },
    subtotalItem: { type: Number, required: true, min: [0, 'El subtotal no puede ser negativo.'] }
});

const pedidoSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Se refiere al modelo 'users' de tu compañero
        required: [true, 'El pedido debe estar asociado a un usuario.']
    },
    items: {
        type: [itemPedidoSchema], // Usamos el schema de arriba
        required: [true, 'El pedido debe contener al menos un ítem.']
    },
    fechaPedido: { type: Date, default: Date.now },
    estado: {
        type: String,
        enum: {
            values: ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'],
            message: '{VALUE} no es un estado de pedido válido.'
        },
        default: 'Pendiente'
    },
    total: { type: Number, required: [true, 'El total del pedido es requerido.'], min: [0, 'El total no puede ser negativo.'] },
    metodoPago: { type: String, required: [true, 'El método de pago es requerido.'], trim: true },
    direccionEnvio: { type: String, required: [true, 'La dirección de envío es requerida.'], trim: true }
}, {
    timestamps: true 
});

export const Pedido = mongoose.model('Pedido', pedidoSchema);