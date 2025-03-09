import express from "express"
import archivosController from "../controller/archivosController.js"
const router = express.Router()

router.post("/subiravatar/:nombre", archivosController.subiravatar)

export default router;