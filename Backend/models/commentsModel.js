import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios', required: true },
    content: { type: String, required: true },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;