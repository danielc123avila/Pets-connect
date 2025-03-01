import express from "express"
import mascotasController from "../controller/mascotasController.js"


/* import {
  crearReporte,
  obtenerMascotas,
  obtenerMascotaPorId,
  eliminarMascota,
  actualizarMascota,
} from "../controller/petsController.js"; */
import { uploadMiddleware } from "../config/multer.js";

const router = express.Router();

/* router.get("/mascotas", obtenerMascotas);
router.get("/mascotas/:id", obtenerMascotaPorId);
router.post("/mascotas", uploadMiddleware, crearReporte);
router.delete("/mascotas/:id", eliminarMascota);
router.put("/mascotas/:id", uploadMiddleware, actualizarMascota); */

router.post("/mascotas/listar", mascotasController.listar)

router.post("/mascotas/listarId", mascotasController.listarId)

router.post("/mascotas/guardar", mascotasController.guardar)

router.post("/mascotas/actualizar", mascotasController.actualizar)

router.post("/mascotas/eliminar", mascotasController.eliminar)

export default router;
