import express from 'express';
import { createComment, deleteComment, getComments, updateComment } from '../controller/commentsController.js';

const router = express.Router();

// Rutas
router.post('/crear', createComment);
router.get('/listar/:petId', getComments);
router.put('/:commentId', updateComment);
router.delete('/:commentId', deleteComment);

export default router;