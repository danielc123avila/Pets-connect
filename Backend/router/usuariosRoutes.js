// routes/usuariosRoutes.js
import express from "express";
import usuariosController from "../controller/usuariosController.js";

const router = express.Router();

// Ruta para guardar usuarios
router.post("/usuarios/guardar", usuariosController.guardar);

export default router;