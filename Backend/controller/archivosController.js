var archivosController = {}
import multer from "multer"

archivosController.subirmascotas = function (request,response){
    var post = {
      nombre:request.params.nombre
    }
    var upload = multer({
      storage:multer.diskStorage ({
        destination:(request,file,cb) =>{
            cb(null,AppRoot + "/Mascotas")
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

export default archivosController