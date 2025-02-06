import express from "express";
import usuariosController from "../controller/usuariosController.js";
import { authMiddleware } from "../middlewares/auth-user.middleware.js"

const router = express.Router();

// Ruta para guardar usuarios
router.post("/usuarios/guardar", usuariosController.guardar);

// Ruta para login de usuarios
router.post("/usuarios/login", usuariosController.login);

// Ruta protegida para el perfil de usuario
router.get("/usuarios/perfil", authMiddleware, usuariosController.perfil);

export default router;
