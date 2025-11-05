import mongoose from "mongoose";
const cartsModel = mongoose.Schema(
    {
        usuario:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
            unique: true // asegura que un usuario solo tenga un carrito activo
        },
        productos:[
            {
                producto:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"Product",
                    required: true
                },
                cantidad:{
                    type: Number,
                    default: 1,
                    min: 1
                }
            }
        ]
    }
)

export const Cart = mongoose.model("Cart",cartsModel)