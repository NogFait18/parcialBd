
const productsModel = mongoose.Schema(
    {
        nombre:{type:String, require:true},
        descripcion:{type:String,required:false},
        categoria:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category',
            required:true
        }, //a revisar la categoria, cualquier cosa cambiamos nombres
        stock:{type:Number,require:true,min:0}, //no estoy seguro de que el stock sea 0 o 1 
        marca:{type:String,required:false} //este no esta incluido en la primer parte, lo incluí por que se pide despues 
    },
)
const Product = mongoose.model('Product',productSchema);
export default Product;