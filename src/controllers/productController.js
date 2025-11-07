import { Product } from "../models/products.js"
import {Categories} from "../models/categories.js"
import {Resenia} from "../models/resenia.js"

//POST/api/productos 
//para crear productos 

export const crearProducto = async(req,res) =>{
    try{
        //info sobre la solicitud
        const{nombre,descripcion,stock,categoria,precio,marca}=req.body;
        
        //validiación a categoria (cuando este la asociamos bien)
        const categoriaExiste = await Categories.findById(categoria);
        
        if(!categoriaExiste){
            return res.status(404).json({msg:'La categoria no existe'})
        }
        //creamos instancia con un objeto
        const producto = new Product({
            nombre,
            descripcion,
            categoria,
            precio,
            stock,
            marca
        });
        //guardar en la bd
        const productoGuardado = await producto.save();

        //respuesta al cliente
        res.status(201).json({
            msg:'Producto creado exitosamente',
            producto:productoGuardado
        });
    }catch(error){
        // Manejo de error para validaciones (ej. campos requeridos, min/max)
        if (error.name === 'ValidationError') {
             return res.status(400).json({ msg: 'Error de validación de datos', error: error.message });
        }
        res.status(500).json({msg:'Error al crear el producto',error:error.message});
    }
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//PUT/api/productos
//para actualizar un producto por id

export const actualizarProducto = async(req, res) => {
    try {
        const { id } = req.params;
        const datosActualizar = req.body; 

        const productoActualizado = await Product.findByIdAndUpdate(
            id,
            datosActualizar, // Usamos el body directamente
            { new: true, runValidators: true } 
        );

        if (!productoActualizado) {
            return res.status(404).json({ msg: 'Producto no encontrado.' });
        }

        res.status(200).json({ msg: 'Producto actualizado correctamente.', producto: productoActualizado });

    } catch(error) {
        res.status(500).json({ msg: 'Error al actualizar el producto', error: error.message });
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
        res.status(200).json({msg:'Producto eliminado correctamente!'})
    }catch(error){
        res.status(500).json({msg:'Error al eliminar',error:error.message});

    }
};



//------------------------------------------------------------------------------------------------------------------------------------------------
//GET/api/productos
//listar productos por categoría
// productsController.js

export const listarProductos = async(req,res)=>{
    try{
        const productos = await Product.aggregate([
            {
                $lookup:{
                    from:'categories', // Nombre de la colección (pluralizado por Mongoose)
                    localField:'categoria', // <--- ¡CORREGIDO! DEBE SER 'categoria'
                    foreignField:'_id',      
                    as:'categoriaInfo'       
                }
            },
            // Si hay productos sin categoría (lo cual no debería ocurrir si required:true),
            // $unwind fallará. Pero si asumes que todos tienen categoría:
            {$unwind:'$categoriaInfo'} 
        ]);
        
        if(productos.length === 0){
            // Usar 200 OK con array vacío si quieres devolver la estructura JSON
            return res.status(200).json([]); 
        }

        res.status(200).json(productos);
    }catch(error){
        // Si hay un error, al menos devolvemos el error.message
        res.status(500).json({msg:'Error al listar productos',error:error.message});
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------

//GET /api/productos/filtro 
//filtrar los productos por rango de precio y marca
export const filtrarProductos = async(req,res)=>{
    const{precioMin,precioMax,marca}=req.query;

    
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
        res.status(200).json(productos);
    }
    catch(error){
        res.status(500).json({msg:'Error al filtrar productos',error:error.message});
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
        res.status(200).json(topProductos);
    }catch(error){
        res.status(500).json({msg:'Error al obtener top productos',error:error.message});
    }
};



//------------------------------------------------------------------------------------------------------------------------------------------------

//PATCH api/productos/:id/stock 
//actualizar stock
export const actualizarStock = async(req, res)  => {
    try{
        const{id} = req.params;
        // CORREGIDO: Obtener nuevoStock de req.body
        const{nuevoStock} = req.body; 

        if(nuevoStock === undefined || typeof nuevoStock !== 'number' || nuevoStock < 0){
            return res.status(400).json({msg:"El stock debe ser un número no negativo."});
        }
        
        // Usamos $set (Requerimiento del parcial)
        const productoActualizado = await Product.findByIdAndUpdate(
            id,
            {$set:{stock:nuevoStock}},
            {new:true}
        );
        
        if(!productoActualizado){
            return res.status(404).json({msg:'Producto no encontrado'}) 
        }
        // CORREGIDO: mensaje de respuesta
        res.status(200).json({msg:"Stock actualizado con exito",producto:productoActualizado}); 
    }catch(error){
        res.status(500).json({msg:"Error al actualizar el stock",error:error.message});
    }
}