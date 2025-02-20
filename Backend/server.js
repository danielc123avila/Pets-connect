import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/dataBase.js";
import usuariosRoutes from './router/usuariosRoutes.js';
import mascotasRoutes from './router/mascotasRoutes.js';
import session from "express-session"
import cookieParser from "cookie-parser"
import config from "./config/config.js"
const app = express();

// config variables de entorno
dotenv.config()

// conect to database
connectDB()

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))



//Interceptor
app.all('*',function(req, res, next){

  var whitelist = req.headers.origin;
  console.log(whitelist)
  res.header('Access-Control-Allow-Origin', whitelist);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEAD');  
  res.header('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  //Interceptors
  res.header("Access-Control-Allow-Credentials", "true");

  next();
    
})


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

//Cors config
app.use(cors({
  origin: function(origin,callback){
    console.log(origin)
    if (!origin) return callback (null,true)
      if (config.origins.indexOf(origin) == -1){
          return callback("error cors sin permisos", false)

      } else {
          return callback (null, true)
      }
            

    }
}))

// routes
app.use("/api", usuariosRoutes)
app.use("/api", mascotasRoutes)

// Usar las rutas de usuarios

// port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});

// export app
export default app;
