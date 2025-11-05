import { Product } from "../models/products"

//POST/api/productos 
//para crear productos 
export const crearProducto = async(nombre, descripcion, categoria, precio, stock)=>{
    //agregar la validacion para categoria, todavia no la puedo hacer
    const Product = new Product(
        nombre,descripcion,categoria,precio,stock
    )
    const newProduct = await Product.save()
    return{Product:newProduct}
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//DELETE/api/productos/id
//eliminar productos
export const eliminarProducto =async(req,res){
    try{
        const Product
    }
}


//------------------------------------------------------------------------------------------------------------------------------------------------
//GET/api/productos
//listar productos por categoría
const listarProductos = async(req,res)=>{
    try{
        const productos = await Product.aggregate([
            {
                $lookup:{
                    from:'categorias',       //la collecion a unir
                    localField:'categoria',  //el campo en Product osea el ObjectId
                    foreignField:'_id',      //el campo en Categoria osea el _id
                    as:'categoriaInfo'       //nombre del nuevo array
                }
            }   
        ]);
        res.json(productos);
    }catch(error){
        res.status(500).json({msg:'Error al listar productos'});
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------------------

//GET /api/productos/filtro 
//filtrar los productos por rango de precio y marca
const filtrarProductos = async(req,res)=>{
    const{precioMin,precioMax,marca}=req.query;

    //creamos un objeto de filtro con el $match
    const filtro={};
    const condiciones = [];

    //condición de Rango de Precio
    if(precioMin && precioMax){
        condiciones.push({
            precio:{
                $gte:parseFloat(precioMin),
                $lte:parseFloat(precioMax)
            }
        });
    }else if(precioMin){
        condiciones.push({precio:{$gte:parseFloat(precioMin) } });
    }else if (precioMax){
        condiciones.push({precio:{$lte:parseFloat(precioMax) } });
    }
    if(marca){
        condiciones.push({marca:{$eq:marca} });
    }

    // si llegan a haber condiciones las juntamos con el $and
    if (condiciones.length > 0){
        filtro.$and = condiciones;
    }

    try{
        //filtración con .find()
        const productos = await Product.find(filtro).populate('categoria');
        res.json(productos);
    }
    catch(error){
        res.status(500).json({msg:'Error al filtrar productos'})
    }
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//GET /api/productos/top 
//obtener los productos más reseñados 
//uso Reseniados y no Reseñados por la "ñ"

export const productosReseniados = async(id, resenia)


//------------------------------------------------------------------------------------------------------------------------------------------------

//PATCH api/productos/:id/stock 
//actualizar stock
export const actualizarStock = async(id, nuevoStock)  => {
    //agrego una validación por la cantidad de stock
    if (nuevoStock < 0){
        throw new Error("El stock no puede ser negativo")
    }

    const actualizarStock = await Product.findByIdAndUpdate(id,
        {$set:{stock:nuevoStock}},
        {new:true}// lo seteo así para que devuelva el doc actualizado
    );
    return actualizarStock;
}