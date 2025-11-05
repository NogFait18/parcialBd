
const productsModel = mongoose.Schema(
    {
        nombre:{type:String, require:true},
        descripcion:{type:String,required:false},
        stock:{type:Number,require:true,min:0}, //no estoy seguro de que el stock sea 0 o 1
        categoria:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category',
            required:true
        }, //a revisar la categoria, cualquier cosa cambiamos nombres
        stock:{type:String,required:true,min:0,default:0},//revisar valores
        marca:{type:String,required:false}
    },
)
export const Product = mongoose.model("products",productsModel)