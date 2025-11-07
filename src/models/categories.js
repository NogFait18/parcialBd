import mongoose from "mongoose";

const categoriesModel = mongoose.Schema(
    {
        nombre: {type:String, required:true},
        descripcion: {type:String, required:true}
    }
)
export const Categories = mongoose.model("Categories",categoriesModel)