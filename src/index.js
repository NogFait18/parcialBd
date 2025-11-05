import express from "express"
import mongoose from "mongoose"
import { usersRoutes } from "./routes/usersRoutes.js"
import { productsRoutes } from "./routes/productsRoutes.js"
import { categoriesRoutes } from "./routes/categoriesRoutes.js"

const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGO_URL,{dbName:process.env.DB_NAME}).then(()=>
    console.log("Conexion Correcta")
).catch((e)=>{
    console.error("Error al conectarse con mongo",e)
})
app.use("/api/usuarios",usersRoutes)
app.use("/api/productos",productsRoutes)
app.use("/api/categorias",categoriesRoutes)

app.listen(process.env.PORT,()=>{
    console.log("Corriendo en el puerto: ",process.env.PORT)
})