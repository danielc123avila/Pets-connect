import express from "express";
import { crearReporte, obtenerMascotas } from "../controller/petsController.js";
import { uploadMiddleware } from "../config/multer.js";

const router = express.Router();

router.get("/mascotas", obtenerMascotas);
router.post("/mascotas", uploadMiddleware, crearReporte);

export default router;
