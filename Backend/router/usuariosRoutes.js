// routes/usuariosRoutes.js
import express from "express";
import usuariosController from "../controller/usuariosController.js";

const router = express.Router()

var soloadmin = function (request, response, next){
    if (request.session.rol == "1"){
      next ()
    }
     else {
      response.json({state:false,mensaje: "Esta Api es de uso exclusivo del administrador"})
    } 
  
}

router.post("/status", usuariosController.status)

router.post("/usuarios/guardar",soloadmin, usuariosController.guardar)

router.post("/usuarios/registro", usuariosController.registro)

router.post("/usuarios/listar", soloadmin, usuariosController.listar)

router.post("/usuarios/listarid",  usuariosController.listarId)

router.post("/usuarios/actualizar", usuariosController.actualizar)

router.post("/usuarios/login", usuariosController.login)

router.post("/logout", usuariosController.logout)

router.post("/usuarios/logingoogle", usuariosController.loginGoogle)

router.post("/usuarios/activar", usuariosController.activar)

router.post("/usuarios/solicitarcodigo", usuariosController.solicitarCodigo)

router.post("/usuarios/recuperarpass", usuariosController.recuperarPass)

router.post("/usuarios/eliminar", soloadmin, usuariosController.eliminar)

export default router