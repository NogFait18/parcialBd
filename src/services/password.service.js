import bcrypt from "bcryptjs"

export const hashPassword = async(contrasena)=>{
    return await bcrypt.hash(contrasena,10)
}
//todo:  comparar contraseñas  
export const validatePass = async (pass,hash)=>{
    return await bcrypt.compare(pass, hash)
}