import mongoose from "mongoose";

const categoriesModel = mongoose.Schema(
    {
        nombre: {type:String, require:true},
        descripcion: {type:String, require:true}
    }
)
export const Categories = mongoose.model("Categories",categoriesModel)