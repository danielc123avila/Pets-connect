import express from "express";
import {
  crearReporte,
  obtenerMascotas,
  obtenerMascotaPorId,
  eliminarMascota,
} from "../controller/petsController.js";
import { uploadMiddleware } from "../config/multer.js";

const router = express.Router();

router.get("/mascotas", obtenerMascotas);
router.get("/mascotas/:id", obtenerMascotaPorId);
router.post("/mascotas", uploadMiddleware, crearReporte);
router.delete("/mascotas/:id", eliminarMascota);

export default router;
