import express from "express"
import archivosController from "../controller/archivosController.js"
const router = express.Router()

router.post("/subirmascotas/:nombre", archivosController.subirmascotas)

export default router;