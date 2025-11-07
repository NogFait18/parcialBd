import { User } from "../models/users.js"
import { Cart } from "../models/carts.js"

//POST/api/usuarios
//para crear usuario

export const crearUsuario = async(nombre,email,direccion,telefono,rol)=>{
    const user = new User(
        {
            nombre,email,direccion,telefono,rol
        }
    )
    const newUser = await user.save()

    return{user:newUser} 
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//DELETE/api/productos
//para eliminar un producto por id
export const eliminarUsuario = async(id)=>{
    return await User.findByIdAndDelete(id)
}


//------------------------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------------------------------------
//GET/api/productos
//para mostrar a los usuarios

export const mostrarUsuario = async () =>{
    return await User.find()
}



//------------------------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------------------------------------
//PUT/api/productos
//para actualizar un producto por id

export const actualizarUsuario = async(id,data)=>{
    return await User.findByIdAndUpdate(
        id,
        data,
        {new: true}
    )
}

//------------------------------------------------------------------------------------------------------------------------------------------------

export const eliminarUsuarioYCarrito = async (id) => {
  // Elimina el usuario
  const usuarioEliminado = await User.findByIdAndDelete(id);
  if (!usuarioEliminado) return null;

  // Elimina también su carrito si existe
  await Cart.deleteOne({ userId: id });

  return usuarioEliminado;
};

export const obtenerUsuarioPorId = async (id) => {
  return await User.findById(id);
};