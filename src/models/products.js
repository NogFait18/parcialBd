import mongoose from "mongoose"
const productsModel = mongoose.Schema(
    {
        nombre:{type:String, required:true},
        descripcion:{type:String,required:false},

        stock:{type:Number,required:true,min:0,default:0}, //no estoy seguro de que el stock sea 0 o 1
        categoria:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Categories',
            required:true
        }, 
        precio: {type:Number, required:true},
        marca:{type:String,required:false} //este no esta incluido en la primer parte, lo incluí por que se pide despues 
    },
)
export const Product = mongoose.model("Product",productsModel)

