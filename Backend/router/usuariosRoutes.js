// routes/usuariosRoutes.js
import express from "express";
import usuariosController from "../controller/usuariosController.js";

const router = express.Router();


router.post("/usuarios/guardar", usuariosController.guardar)

router.post("/usuarios/registro", usuariosController.registro)

router.post("/usuarios/listar", usuariosController.listar)

router.post("/usuarios/listarid", usuariosController.listarId)

router.post("/usuarios/actualizar", usuariosController.actualizar)

router.post("/usuarios/login", usuariosController.login)

router.post("/usuarios/logingoogle", usuariosController.loginGoogle)

router.post("/usuarios/activar", usuariosController.activar)

router.post("/usuarios/solicitarcodigo", usuariosController.solicitarCodigo)

router.post("/usuarios/recuperarpass", usuariosController.recuperarPass)

router.post("/usuarios/eliminar", usuariosController.eliminar)

export default router