import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/dataBase.js";
import usuariosRoutes from "./router/usuariosRoutes.js";
import mascotasRoutes from "./router/mascotasRoutes.js";
import commentRoutes from "./router/commetRoutes.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import path from "path";
import { fileURLToPath } from "url"; // Importa esta función

const app = express();

// config variables de entorno
dotenv.config();

// conect to database
connectDB();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Interceptor
app.all("*", function (req, res, next) {
  const whitelist = req.headers.origin;
  console.log(whitelist);
  res.header("Access-Control-Allow-Origin", whitelist);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,OPTIONS,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  next();
});

// Session/Cookie config
app.use(cookieParser());
app.use(
  session({
    secret: config.sesiones.secret,
    resave: true, // guarda la sesión si no se ha modificado
    saveUninitialized: true, // guarda la sesión así no se haya iniciado
    cookie: {
      maxAge: config.sesiones.expiracion,
      httpOnly: true, // el tiempo por el que va a estar activa una sesión
    },
    name: "CookieApp", // nombre del archivo que se descarga desde el backend hasta el frontend
    rolling: true,
  })
);

// CORS config
app.use(
  cors({
    origin: function (origin, callback) {
      console.log(origin);
      if (!origin) return callback(null, true);
      if (config.origins.indexOf(origin) == -1) {
        return callback("error cors sin permisos", false);
      } else {
        return callback(null, true);
      }
    },
  })
);

// Obtener el directorio actual usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos desde la carpeta 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/api/images", (req, res) => {
  const images = [
    { id: 1, url: "/uploads/image1.jpg" },
    { id: 2, url: "/uploads/image2.jpg" },
  ];
  res.json(images);
});
// Routes
app.use("/api", usuariosRoutes);
app.use("/api", mascotasRoutes);
app.use('/api/comments', commentRoutes);

// Port
console.log("PORT desde .env:", process.env.PORT);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export app
export default app;
