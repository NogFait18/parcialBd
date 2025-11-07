import express from "express"
import { actualizarUsuario, crearUsuario, eliminarUsuario, eliminarUsuarioYCarrito, mostrarUsuario, obtenerUsuarioPorId } from "../controllers/usersController.js"

export const usersRoutes = express.Router()

usersRoutes.get("/",async(req,res)=>{
    try {
        const user = await mostrarUsuario()
        if(user.length === 0){
            return res.status(204).json([])
        }
        res.status(200).json(user)
    } catch (err){
        res.status(500).json({mensaje: `Error en el get de users: ${err}`})
    }
})

usersRoutes.post("/",async (req,res)=>{
    try{
        const {nombre,email,direccion,telefono,rol} = req.body
        if(!nombre || !email || !direccion || !telefono || !rol ){
            res.status(400).json({mensaje: `Algunos de los parametros faltan`})
        }
        const newUser = await crearUsuario(nombre,email,direccion,telefono,rol)
        res.status(201).json(newUser)
    }catch (error) {
        res.status(500).json({message: `Error en el get de users: ${error}`})
    }
})

usersRoutes.delete("/:id",async (req,res)=>{
    const {id} = req.params
    const userDelete = await eliminarUsuario(id)
    if(!userDelete){
        res.status(404).json({mensaje: `No se encontro al usuario a eliminar`})
    }
    res.status(200).json ({mensaje: `Elimino correctamente`})
})

usersRoutes.put("/:id",async(req,res)=>{
    try{
        const {id} = req.params
        const {nombre,email,direccion,telefono} = req.body
        const updateUser = await actualizarUsuario(
            id,
            {nombre,email,direccion,telefono},
            {new:true}
        )
        if(!updateUser){
            res.status(404).json({mensaje: `No se encontro el usuario`})
        }
        res.status(200).json(updateUser)
    }catch(error){
        res.status(500).json({mensaje: `Error al actualizar al usuario`})
    }
})

//GET /api/users/:id → Detalle de un usuario
usersRoutes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await obtenerUsuarioPorId(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ mensaje: "Error al obtener usuario" });
  }
});

usersRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await eliminarUsuarioYCarrito(id);

    if (!eliminado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.status(200).json({ mensaje: "Usuario y carrito eliminados correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
});
