import express from "express";
import {
  crearReporte,
  obtenerMascotas,
  obtenerMascotaPorId,
  eliminarMascota,
  actualizarMascota,
} from "../controller/petsController.js";
import { Multer } from "../config/multer.js";

const router = express.Router();

router.get("/mascotas", obtenerMascotas);
router.get("/mascotas/:id", obtenerMascotaPorId);
router.post("/mascotas", Multer, crearReporte);
router.delete("/mascotas/:id", eliminarMascota);
router.put("/mascotas/:id", Multer, actualizarMascota);

export default router;
