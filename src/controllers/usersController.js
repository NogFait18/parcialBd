import { User } from "../models/users.js"

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

export const actualizarUsuario = async()=>{
    return await User.findByIdAndUpdate(
        id,
        {nombre,email,direccion,telefono,rol},
        {new: true}
    )
}

//------------------------------------------------------------------------------------------------------------------------------------------------