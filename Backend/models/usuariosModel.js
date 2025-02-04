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
    estado: { type: String, default: '0' },
    codepass: String,
    ultlogin: Date,
    rol: String,
    azar:String
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
        return callback({ state: true, mensaje: "Usuario guardado" })
    })

    .catch((error) => {
    console.error(error);
    return callback({ state: false, mensaje: "Se presentó un error" })
    })
}

usuariosModel.registrar = function(post, callback){
    
    const instancia = new Usuarios({
        nombre: post.String,
        email: post.email,
        password: post.password,
        telefono: post.telefono,
        rol: post.rol,
        azar : post.azar
    })
    
    instancia.save().then((respuesta) => {
    console.log(respuesta)
    return callback ({state:true, mensaje:"usuario guardado"})

    }).catch ((error) => {
       console.log(error)
       return callback ({state:false, mensaje:"se presento un error"})
    })
}

usuariosModel.existeEmail = function (post, callback){
    Usuarios.findOne({email:post.email},{}).then((respuesta) =>{
        if (respuesta == null){
            return callback({existe:'no'})
        }
        else {
            return callback({existe:'si'})
        }
    })  
}

usuariosModel.listar = function(post, callback){
    Usuarios.find({}, {password:0}).then ((respuesta) => {
     return callback({state:true, datos:respuesta})
    })
    .catch ((error) => {
     return callback ({state:false, datos:[], error:error, mensaje:"se presento un error"})
    })     
}

usuariosModel.listarId = function(post, callback){
    Usuarios.find({_id:post._id}, {password:0}).then ((respuesta) => {
     return callback({state:true, datos:respuesta})
    })
    .catch ((error) => {
     return callback ({state:false, datos:[], error:error, mensaje:"se presento un error"})
    })
}

usuariosModel.actualizar = function (post, callback){

    Usuarios.findByIdAndUpdate(post._id, // Mymodel.findOneAndUpdate({_id:post._id} es una opcion
    {
        nombre:post.nombre,
        rol:post.rol,
        estado:post.estado,
        telefono:post.telefono
    

    }) .then((respuesta) => {
        return callback ({state:true, mensaje:"Elemento actualizado"})
        console.log(respuesta)

    })
    .catch ((error) => {
        return callback ({state:false, mensaje:"Error al actualizar", error:error})
    })
                        
}

// Export the function and model
export default usuariosModel
