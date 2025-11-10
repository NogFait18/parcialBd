import express from "express"
import mongoose from "mongoose"

import { usersRoutes } from "./routes/usersRoutes.js"
import { productsRoutes } from "./routes/productsRoutes.js"
import { categoriesRoutes } from "./routes/categoriesRoutes.js"
import { reseniasRoutes } from "./routes/reseniasRoutes.js"
import { pedidosRoutes } from "./routes/pedidosRoutes.js"
import { cartsRoutes } from "./routes/cartsRoutes.js"


const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGO_URI,{dbName:process.env.DB_NAME}).then(()=>
    console.log("Conexion Correcta")
).catch((e)=>{
    console.error("Error al conectarse con mongo",e)
})
app.use("/api/usuarios",usersRoutes)
app.use("/api/productos",productsRoutes)
app.use("/api/carrito",cartsRoutes)
app.use("/api/categorias",categoriesRoutes)
app.use("/api/ordenes",pedidosRoutes)
app.use("/api/resenas",reseniasRoutes)

app.listen(process.env.PORT,()=>{
    console.log("Corriendo en el puerto: ",process.env.PORT)
})