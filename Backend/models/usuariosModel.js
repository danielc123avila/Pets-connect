const usuariosModel = {}
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
usuariosModel.guardar = function (post, callback) {
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
}

usuariosModel.existeEmail = function (post, callback){

    Usuarios.findOne({email:post.email},{}).then((respuesta) =>{
        //el null es la respuesta del servidor si los datos ingresados no existen
        if (respuesta == null){
            return callback({existe:'no'})
        }
        else {
            return callback({existe:'si'})
        }
    })
    //hacer busqueda en elementos
    //var posicion =bdusuarios.findIndex((item) => item.email == post.email)
    //Igual o mayor a cero significa que si existe
    // if(posicion >=0){
    //     return callback({existe:'si'})
    // }
    // else {
    //     return callback({existe:'no'})
    // }

}

// Export the function and model
export default usuariosModel
