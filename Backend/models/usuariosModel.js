usuariosModel = {}
//Table maestra base de datos, esquema
import mongoose from "mongoose"
var Schema = mongoose.Schema
//definicion del objeto schema
var usuariosSchema = new Schema({
    nombre:String,
    email:String,
    password:String,
    telefono:Number,
    errorlogin:Number,
    fechalogin:Date,
    azar:String,
    //Activacion de la cuenta esta asociada entra la activacion de la cuenta y el Azar
    estado:String,
    //Recuperacion de contraseña
    codepass:String,
    ultlogin:Date,
    rol:String

})

const Mymodel = mongoose.model("usuarios" ,usuariosSchema)

usuariosModel.guardar = function(post, callback){
   
    const instancia = new Mymodel ({
        nombre: post.nombre,
        email: post.email,
        password: post.password,
        telefono: post.telefono,
        errorlogin: 0,
        fechalogin: new Date(),
        estado: '1',
        rol: post.rol
    })

   //almacenamos la informacion
    instancia.save().then((respuesta) => {
    console.log(respuesta)
    return callback ({state:true, mensaje:"usuario guardado"})

    }).catch ((error) => {
       console.error(error)
       return callback ({state:false, mensaje:"se presento un error"})
    })
}   

export default usuariosModel
