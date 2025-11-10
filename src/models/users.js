import mongoose from "mongoose";

const userModel = mongoose.Schema(
    {
        nombre: {type:String,require:true},
        email: {type:String},
        direccion: {type:String},
        telefono:{type:String},
        rol:{type:String},
        contrasena: {type:String, required:true}
    },
)
export const User = mongoose.model("User",userModel)