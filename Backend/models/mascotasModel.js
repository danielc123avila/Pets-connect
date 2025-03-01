const mascotasModel = {}
import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the schema
const mascotasSchema = new Schema({
    nombre: String,
    especie: String,
    sexo: String,
    color: String,
    raza: String,
    fechaExtravio: { type: Date, default: Date.now },
    email:String,
    celular:Number,
    ultimaUbicacion:String,
    descripcion:String,
    palabraClave:[],
    estado:String,
    dueno: String,
    azar:String,
    imagen:String,

})

const Mascotas = mongoose.model("mascotas", mascotasSchema)


mascotasModel.guardar = function (post, callback) {
    const instancia = new Mascotas({
        nombre: post.nombre,
        especie: post.especie,
        sexo: post.sexo,
        color: post.color,
        raza: post.raza,
        fechaExtravio: post.fechaExtravio || Date.now(), 
        email: post.email,
        celular: post.celular,
        ultimaUbicacion: post.ultimaUbicacion,
        descripcion: post.descripcion,
        palabraClave: post.palabraClave || [], 
        estado: post.estado,
        dueno: post.dueno,
        azar: post.azar,
        imagen: post.imagen ? post.imagen : "assets/noimagen.jpg"
    })

    // Guardar la información
    instancia.save()
    .then((respuesta) => {
        console.log(respuesta);
        return callback({ state: true, mensaje: "Mascota guardada" })
    })
    .catch((error) => {
        console.error(error);
        return callback({ state: false, mensaje: "Se presentó un error" })
    })
}

mascotasModel.listar = function (post, callback) {
    Mascotas.find({})
    .then((respuesta) => {
        return callback({ state: true, datos: respuesta })
    })
    .catch((error) => {
        return callback({ state: false, datos: [], error: error, mensaje: "Se presentó un error" })
    })
}

mascotasModel.listarId = function (post, callback) {
    Mascotas.find({ _id: post._id })
    .then((respuesta) => {
        return callback({ state: true, datos: respuesta })
    })
    .catch((error) => {
        return callback({ state: false, datos: [], error: error, mensaje: "Se presentó un error" })
    })
}

mascotasModel.actualizar = function (post, callback) {
    Mascotas.findByIdAndUpdate(
        post._id,
        {
            nombre: post.nombre,
            especie: post.especie,
            sexo: post.sexo,
            color: post.color,
            raza: post.raza,
            fechaExtravio: post.fechaExtravio,
            email: post.email,
            celular: post.celular,
            ultimaUbicacion: post.ultimaUbicacion,
            descripcion: post.descripcion,
            palabraClave: post.palabraClave,
            estado: post.estado,
            dueno: post.dueno,
            azar: post.azar,
            imagen:post.imagen,
        }
    )
    .then(() => {
        return callback({ state: true, mensaje: "Mascota actualizada correctamente" })
    })
    .catch((error) => {
        return callback({ state: false, mensaje: "Error al actualizar", error: error })
    })
}

mascotasModel.eliminar = function (post, callback) {
    Mascotas.findByIdAndDelete(post._id)
        .then(() => {
            callback({ state: true, mensaje: "Mascota eliminada correctamente" })
        })
        .catch((error) => {
            callback({ state: false, mensaje: "Error al eliminar la mascota", error })
        })
}


