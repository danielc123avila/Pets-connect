import mongoose from 'mongoose';
import Comment from '../models/commentsModel.js';
import Pet from '../models/petsModel.js';

export const createComment = async (req, res) => {
    try {
        const { userId, content, petId } = req.body;

        // Validar si la mascota existe
        const petExist = await Pet.findById(petId);
        if (!petExist) {
            return res.status(400).json({ state: false, mensaje: 'Mascota no encontrada' });
        }

        const newComment = new Comment({ userId, content, petId });
        await newComment.save();

        res.status(201).json({ state: true, mensaje: 'Comentario creado con éxito', comment: newComment });
    } catch (error) {
        console.error('Error al crear el comentario', error);
        res.status(500).json({ state: false, mensaje: 'Hubo un problema al crear el comentario' });
    }
};

export const getComments = async (req, res) => {
    try {
        let { petId } = req.params;
        petId = petId.trim();
        console.log(req.params)
        console.log("Pet ID recibido en el backend:", petId);

        // Validar si el ID es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(petId)) {
            console.error("ID de mascota inválido:", petId);
            return res.status(400).json({ state: false, mensaje: "ID de mascota inválido" });
        }

        // Convertir petId a ObjectId antes de la consulta
        const comments = await Comment.find({ petId: new mongoose.Types.ObjectId(petId) })
            .populate("userId", "nombre email");

        console.log("Comentarios encontrados:", comments);
        res.status(200).json({ state: true, comments });
    } catch (error) {
        console.error("Error al obtener los comentarios", error);
        res.status(500).json({ state: false, mensaje: "Hubo un problema al obtener los comentarios" });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true } // Retorna el comentario actualizado
        );

        if (!comment) {
            return res.status(404).json({ state: false, mensaje: 'Comentario no encontrado' });
        }

        res.status(200).json({ state: true, mensaje: 'Comentario actualizado con éxito', comment });
    } catch (error) {
        console.error('Error al actualizar el comentario:', error);
        res.status(500).json({ state: false, mensaje: 'Hubo un problema al actualizar el comentario' });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findByIdAndDelete(commentId);

        if (!comment) {
            return res.status(404).json({ state: false, mensaje: 'Comentario no encontrado' });
        }

        res.status(200).json({ state: true, mensaje: 'Comentario eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el comentario:', error);
        res.status(500).json({ state: false, mensaje: 'Hubo un problema al eliminar el comentario' });
    }
};

