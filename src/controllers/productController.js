import { Product } from "../models/products.js"

//POST/api/productos 
//para crear productos 

export const crearProducto = async(req,res) =>{
    try{
        //info sobre la solicitud
        const{nombre,descripcion,stock,categoria,marca}=req.body;
        
        //validiación a categoria (cuando este la asociamos bien)
        const categoriaExiste = await categoria.findById(categoria);
        if(!categoriaExiste){
            return res.status(404).json({msg:'La categoria no existe'})
        }
        //creamos instancia con un objeto
        const producto = new Product({
            nombre,
            descripcion,
            categoria,
            precio,stock
        });
        //guardar en la bd
        const productoGuardado = await producto.save();

        //respuesta al cliente
        res.status(201).json({
            msg:'Producto creado exitosamente',
            producto:productoGuardado
        });
    }catch(error){
        res.status(500).json({msg:'Error al crear el producto',error:error.message});
    }
};
//------------------------------------------------------------------------------------------------------------------------------------------------
//DELETE/api/productos/id
//eliminar productos
export const eliminarProducto = async(req,res) =>{
    try{
        //conseguimos la ID de los parámetros de la URL
        const {id}=req.params;
        
        //acá buscamos el objeto por su id y lo eliminamos
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({msg:'Producto no encontrado :/'})
        }
        res.json({msg:'Producto eliminado correctamente!'})
    }catch(error){
        res.status(500).json({msg:'Error al eliminar',error:error.message});

    }
};



//------------------------------------------------------------------------------------------------------------------------------------------------
//GET/api/productos
//listar productos por categoría
export const listarProductos = async(req,res)=>{
    try{
        const productos = await Product.aggregate([
            {
                $lookup:{
                    from:'categorias',       //la collecion a unir
                    localField:'categoria',  //el campo en Product osea el ObjectId
                    foreignField:'_id',      //el campo en Categoria osea el _id
                    as:'categoriaInfo'       //nombre del nuevo array
                }
            }   ,
            {$unwind:'$categoriaInfo'} //esto es para que el array categoriaInfo sea mas presentable
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
//uso Resenas y no reseñas por la ñ y por que así esta en el pdf


//acá habria que hacer un import {Resnenia} from .....
export const productosReseniados = async(req,res)=>{
    try{
        const topProductos = await Resenia.aggregate([
            //las agregamos por grupo y las contamos
            {
                $group:{
                    _id:'$producto',
                    totalResenas:{$sum:1}
                }
            },
            //orden de mayor a manor
            {$sort:{totalResenas:-1}},
            //info de producto con $lookup 
            {
                $lookup:{
                    from:'products',
                    localField:'_id',
                    foreignField:'_id',
                    as:'productoInfo'
                }
            },
            {$unwind:'$productoInfo'}
        ]);
    }catch(error){
        res.status(500).json({msg:'Error al obtener top productos',error:error.message});
    }
};



//------------------------------------------------------------------------------------------------------------------------------------------------

//PATCH api/productos/:id/stock 
//actualizar stock
export const actualizarStock = async(req, res)  => {
    try{
        //recibir el id
        const{id} = req.params;
        //recibir el stock
        const{nuevoStock}=req.body;
        //validación a revisar
        if(nuevoStock===undefined||nuevoStock<0){
            return res.status(400).json({msg:"El stock no puede ser negativo o nulo"});
        }
        //actualizamos el stock
        const productoActualizado = await Product.findByIdAndUpdate(
            id,
            {$set:{stock:nuevoStock}},
            {new:true}//a revisar, en teoria devolveria el doc actualizado
        );
        if(!productoActualizado){
            return res.status(404).json({msg:'Producto no encontrado'}) //nose si es la forma correcta del error
        }
    }catch(error){
        res.status(500).json({msg:"Error al actualizar el stock",error:error.message});
    }
}