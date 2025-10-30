import { User } from "../models/users.js"

export const crearUsuario = async(nombre,email,direccion,telefono,rol)=>{
    const user = new User(
        {
            nombre,email,direccion,telefono,rol
        }
    )
    const newUser = await user.save()

    return{user:newUser} 
}

