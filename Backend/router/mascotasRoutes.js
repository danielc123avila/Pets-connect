import express from 'express';
import { crearReporte } from '../controller/petsController.js';
import { uploadMiddleware } from '../config/multer.js';

const router = express.Router();


router.post('/mascotas', 
  uploadMiddleware,
  (req, res, next) => {

    const requiredFields = ['especie', 'nombre', 'ultimaUbicacion'];
    const missing = requiredFields.filter(field => !req.body[field]);
    
    if (missing.length > 0) {
      return res.status(400).json({
        error: `Faltan campos requeridos: ${missing.join(', ')}`
      });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos 1 foto' });
    }
    
    next();
  },
  crearReporte
);



export default router;
