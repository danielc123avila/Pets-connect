// routes/usuariosRoutes.js
import express from "express";
import usuariosController from "../controller/usuariosController.js";

const router = express.Router();

// Ruta para guardar usuarios
router.post("/usuarios/guardar", usuariosController.guardar)

// Ruta para guardar usuarios
router.post("/usuarios/registro", usuariosController.registro)

//Ruta para listar usuarios
router.post("/usuarios/listar", usuariosController.listar)

//Ruta para listar id
router.post("/usuarios/listarId", usuariosController.listarId)


export default router