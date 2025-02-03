import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/dataBase.js";
import usuariosRoutes from './router/usuariosRoutes.js';


const app = express();

// config variables de entorno
dotenv.config();

// conect to database
connectDB();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




// routes
app.use("/api", usuariosRoutes)

// port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// export app
export default app;
