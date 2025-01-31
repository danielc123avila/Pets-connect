import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the schema
const usuariosSchema = new Schema({
    nombre: String,
    email: String,
    password: String,
    telefono: Number,
    errorlogin: { type: Number, default: 0 },
    fechalogin: { type: Date, default: Date.now },
    azar: String,
    estado: { type: String, default: '1' },
    codepass: String,
    ultlogin: Date,
    rol: String
});

// Create the model
const Usuarios = mongoose.model("Usuarios", usuariosSchema);

// Function to save user data
const guardarUsuario = (post, callback) => {
    const instancia = new Usuarios({
        nombre: post.nombre,
        email: post.email,
        password: post.password,
        telefono: post.telefono,
        rol: post.rol
    });

    // Save the information
    instancia.save()
        .then((respuesta) => {
            console.log(respuesta);
            return callback({ state: true, mensaje: "Usuario guardado" });
        })
        .catch((error) => {
            console.error(error);
            return callback({ state: false, mensaje: "Se presentó un error" });
        });
};

// Export the function and model
export { Usuarios, guardarUsuario };
