import express from "express";
import authController from "../controller/authController.js";
const router = express.Router();

router.post("/token", authController.token);

export default router;