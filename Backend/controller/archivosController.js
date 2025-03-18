var archivosController = {}
import multer from "multer"

archivosController.subiravatar = function (request,response){
  var post = {
    nombre:request.params.nombre
  }
 var upload = multer({
    storage:multer.diskStorage ({
        destination:(request,file,cb) =>{
            cb(null,AppRoot + "/Avatar")
        },
        filename:(req, file,cb) => {
            cb(null,post.nombre + '.png')
        }
    })
 }).single("userFile")


    upload(request, response, function (err){
        if (err){
            console.log(err)
            response.json(err)
        }
        else {
            response.json({state:true})
        }
    })
}  

import path from "path";
import fs from "fs";

// Asegúrate de que la carpeta Avatar exista, si no la crea
const avatarPath = path.join(process.cwd(), "Avatar");

if (!fs.existsSync(avatarPath)) {
    fs.mkdirSync(avatarPath);
}

var archivosController = {};

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, avatarPath); // Directorio donde se guarda la imagen
    },
    filename: (req, file, cb) => {
        const nombre = req.params.nombre || "default"; // Si no hay nombre, usa 'default'
        cb(null, nombre + ".png"); // Guardar como nombre.png
    }
});

// Asegúrate de aceptar solo imágenes PNG
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes JPG, JPEG y PNG.'));
    }
};

const upload = multer({ storage, fileFilter }).single("userFile");

archivosController.subiravatar = function (request, response) {
    upload(request, response, function (err) {
        if (err) {
            console.error("Error en la subida:", err);
            return response.status(500).json({ state: false, error: err.message });
        }

        // Verificar si el archivo realmente se guardó
        if (!request.file) {
            return response.status(400).json({ state: false, mensaje: "No se subió ningún archivo" });
        }

        console.log("Archivo subido correctamente:", request.file.filename);
        response.json({ state: true, mensaje: "Imagen subida con éxito", ruta: request.file.path });
    });
};

export default archivosController;

