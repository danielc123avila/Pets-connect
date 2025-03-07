// Model
import mascotasModel from "../models/mascotasModel.js";
// Controller
var mascotasController = {}


mascotasController.guardar = function (request, response) {

    var post = {
        nombre: request.body.nombre,
        especie: request.body.especie,
        sexo: request.body.sexo,
        color: request.body.color,
        raza: request.body.raza,
        fechaExtravio: request.body.fechaExtravio || Date.now(),
        email: request.body.email,
        celular: request.body.celular,
        ultimaUbicacion: request.body.ultimaUbicacion,
        descripcion: request.body.descripcion,
        palabraClave: request.body.palabraClave || [],
        estado: request.body.estado,
        dueno: request.body.dueno,
        imagen: request.body.imagen,
        azar: request.body.azar
    }

    if (!post.nombre) {
        return response.json({ state: false, mensaje: "El campo nombre es obligatorio" })
    }
    if (!post.especie) {
        return response.json({ state: false, mensaje: "El campo especie es obligatorio" })
    }
    if (!post.sexo) {
        return response.json({ state: false, mensaje: "El campo sexo es obligatorio" })
    }
    if (!post.color) {
        return response.json({ state: false, mensaje: "El campo color es obligatorio" })
    }
    if (!post.raza) {
        return response.json({ state: false, mensaje: "El campo raza es obligatorio" })
    }
    if (!post.email) {
        return response.json({ state: false, mensaje: "El campo email es obligatorio" })
    }
    if (!post.celular) {
        return response.json({ state: false, mensaje: "El campo celular es obligatorio" })
    }
    if (!post.ultimaUbicacion) {
        return response.json({ state: false, mensaje: "El campo última ubicación es obligatorio" })
    }
    if (!post.descripcion) {
        return response.json({ state: false, mensaje: "El campo descripción es obligatorio" })
    }
    if (!post.estado) {
        return response.json({ state: false, mensaje: "El campo estado es obligatorio" })
    }
    /* if (!post.dueno) {
        return response.json({ state: false, mensaje: "El campo dueño es obligatorio" })
    } */

    mascotasModel.guardar(post, function (respuesta) {
        response.json(respuesta);
    })
}

mascotasController.listar = function (request, response) {
    mascotasModel.listar(null, function (respuesta) {
        response.json(respuesta);
    })
}

mascotasController.listarId = function (request, response) {
    const post = {
        _id: request.body._id
    }

    if (!post._id) {
        return response.json({ state: false, mensaje: "El campo _id es obligatorio" });
    }

    mascotasModel.listarId(post, function (respuesta) {
        response.json(respuesta);
    })
}

mascotasController.actualizar = function (request, response) {
    const post = {
        _id: request.body._id,
        nombre: request.body.nombre,
        especie: request.body.especie,
        sexo: request.body.sexo,
        color: request.body.color,
        raza: request.body.raza,
        fechaExtravio: request.body.fechaExtravio,
        email: request.body.email,
        celular: request.body.celular,
        ultimaUbicacion: request.body.ultimaUbicacion,
        descripcion: request.body.descripcion,
        palabraClave: request.body.palabraClave,
        estado: request.body.estado,
        dueno: request.body.dueno,
        imagen: request.body.imagen,
        azar: request.body.azar
    };

    // Validación de campos obligatorios
    const camposObligatorios = ["_id", "nombre", "especie", "sexo", "color", "raza", "estado", "dueno"]
    for (const campo of camposObligatorios) {
        if (!post[campo]) {
            return response.json({ state: false, mensaje: `El campo ${campo} es obligatorio` })
        }
    }
    // Validar número de celular
    const phoneRegex = /^[0-9]{10}$/;
    if (post.celular && !phoneRegex.test(post.celular)) {
        return response.json({ state: false, mensaje: "El número de celular no es válido." })
    }
    mascotasModel.actualizar(post, function (respuesta) {
        response.json(respuesta);
    })
}

mascotasController.eliminar = function (request, response) {
    const post = { _id: request.body._id }

    if (!post._id) {
        return response.json({ state: false, mensaje: "El campo _id es obligatorio" })
    }
    mascotasModel.eliminar(post, function (respuesta) {
        response.json(respuesta);
    })
}

export default mascotasController