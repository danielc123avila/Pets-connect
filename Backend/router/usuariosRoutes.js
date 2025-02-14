import express from "express";
import usuariosController from "../controller/usuariosController.js";
// import { authMiddleware } from "../middlewares/auth-user.middleware.js";
// import token from "../controller/authController.js";

const router = express.Router();

// Ruta para guardar usuarios
router.post("/usuarios/guardar", usuariosController.guardar);

// Ruta para registro de  usuarios
router.post("/usuarios/registro", usuariosController.registro);

//Ruta para listar usuarios
router.post("/usuarios/listar", usuariosController.listar);

//Ruta para listar id
router.post("/usuarios/listarid", usuariosController.listarId);

//Ruta para actualizar
router.post("/usuarios/actualizar", usuariosController.actualizar);

//Ruta para listar login
router.post("/usuarios/activar", usuariosController.activar);

//Ruta para solicitar codigo
router.post("/usuarios/solicitarcodigo", usuariosController.solicitarCodigo);

//Ruta para recuperar password
router.post("/usuarios/recuperarpass", usuariosController.recuperarPass);

//Ruta para  eliminar
router.post("/usuarios/eliminar", usuariosController.eliminar);

// Ruta para login de usuarios
router.post("/usuarios/login", usuariosController.login);

// Ruta protegida para el perfil de usuario
// router.get("/usuarios/perfil", authMiddleware, usuariosController.perfil);

export default router;
