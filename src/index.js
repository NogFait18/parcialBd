import express from "express"
import mongoose from "mongoose"
import { usersRoutes } from "./routes/usersRoutes.js"

const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGO_URL,{dbName:process.env.DB_NAME}).then(()=>
    console.log("Conexion Correcta")
).catch((e)=>{
    console.error("Error al conectarse con mongo",e)
})
app.use("/users",usersRoutes)

app.listen(process.env.PORT,()=>{
    console.log("Corriendo en el puerto: ",process.env.PORT)
})