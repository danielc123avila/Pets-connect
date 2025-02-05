import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser"
import connectDB from "./config/dataBase.js"
import usuariosRoutes from './router/usuariosRoutes.js'
import session from "express-session"
import cookieParser from "cookie-parser"
import config from "./config/config.js"
const app = express()

// config variables de entorno
dotenv.config()

// conect to database
connectDB()

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//Session/Cookie config
app.use(cookieParser())                       
app.use(session({
    secret:config.sesiones.secret, 
    resave:true, //guarda la sesion si no se ha modificado
    saveUninitialized:true,// guarde la sesion asi no se haya iniciado 
    cookie:{
        //Tambien se puede configurar el tiempo desde el config conmaxAge.sessiones.expiracion
        maxAge:config.sesiones.expiracion, httpOnly:true,// el tiempo por el que va estar activo una sesion  

    },
    name: "CookieApp",//CokieApp // nombre del archivo que se descarga desde el backend hasta el frontend
    rolling:true
}))



// routes
app.use("/api", usuariosRoutes)

// port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});

// export app
export default app;
