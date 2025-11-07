import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const reseniaSchema = new Schema({
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Product', // Se refiere al modelo "Product"
        required: [true, 'La reseña debe estar asociada a un producto.']
    },
    
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'users', // Se refiere al modelo "users" (tu nombre de modelo)
        required: [true, 'La reseña debe estar asociada a un usuario.']
    },
    calificacion: {
    type: Number,
    required: [true, 'La calificación es obligatoria.'],
    min: 1,
    max: 5
},
comentario: {
    type: String,
    trim: true
}
    
    
}, {
    timestamps: true
});

export const Resenia = mongoose.model('Resenia', reseniaSchema);