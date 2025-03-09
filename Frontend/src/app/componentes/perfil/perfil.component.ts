import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PeticionService } from '../../servicios/peticionservice.service';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { DashboardComponent } from "../dashboard/dashboard.component";
declare var $:any 


@Component({
  selector: 'app-perfil',
  imports: [FormsModule, CommonModule, DashboardComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit{

  constructor(public peticion:PeticionService, private router:Router){}

  // la respuesta de la peticion se guarda en el siguiente array
  datos:any [] = []
  // variables de ng que estan en html
  nombre:string=""
  imagen:string=""
  email:string=""
  telefono : number = 0
  password:string=""
  // Aca estamos almacenando el Id, para usarla mas adelante
  IdSeleccionado:string=""
  estado:string = "1"
  rol:string = ""
  _id:string= ""
  random:number = 0
  nombrearchivo:string = "Upload"
  avatarUrl: string = ""

  ngOnInit(): void {
    this.status()

  }

  status() {
    let data = {
      host: this.peticion.urlHost,
      path: "/api/status",
      payload: {},
    }
  
    this.peticion.post(data.host + data.path, data.payload).then((res: any) => {
      console.log(res);
  
      // Asigna el rol
      switch (res.rol) {
        case "0":
          this.rol = "Cliente";
          break;
        case "1":
          this.rol = "Administrador";
          break;
        default:
          break;
      }
  
      // Llama a listarId() con el _id del usuario si existe
      if (res._id) {
        this.listarId(res._id);
      }
    })
  }

  listarId(id:string){
    this._id = id
    let data = 
    {
     host:this.peticion.urlHost,
     path:"/api/usuarios/listarId", //este path viene del backend
     payload:{
      _id:id
      
     }
    }
    this.peticion.post(data.host + data.path,data.payload).then((res:any) => {
      console.log(res)
      this.datos = res.datos                     
    })

  }

  recuperar(id: string, event: Event) {
    event.stopPropagation()
    this.router.navigate(['/solicitarcodigo'])
    $('.formdatos').modal('hide') 
  }

  EditarId(_id:string){
    //Usando la variable Id
    this.IdSeleccionado = _id 
    let data = 
    {
     host:this.peticion.urlHost,
     path:"/api/usuarios/listarId", //este path viene del backend
     payload:{
      _id:_id
     }
    }

    this.peticion.post(data.host + data.path,data.payload).then((res:any) => {
      console.log(res)
      $('.formdatos').modal('show')
      this.nombre = res.datos[0].nombre
      this.imagen = res.datos[0].imagen
      this.email = res.datos[0].email
      this.telefono = res.datos[0].telefono
      this.rol = res.datos[0].rol
      this.estado = res.datos[0].estado
      
                               
    })
     
  }

  actualizar (){
  
    let data = 
    {
      host:this.peticion.urlHost,
      path:"/api/usuarios/actualizar", 
      payload:{
      nombre:this.nombre,
      imagen:this.imagen,
      telefono:this.telefono,
      rol:this.rol,
      estado:this.estado,
      _id:this.IdSeleccionado
      
      }
    }

    this.peticion.post(data.host + data.path,data.payload).then((res:any) => {
      console.log(res)
      if (res.state == false){
        Swal.fire({
          title: "Ouch!",
          text: res.mensaje, 
          icon: "error"
        });
      }
      else{
        Swal.fire({
          title: "Que bien!",
          text: res.mensaje, 
          icon: "success"
        });
        $('.formdatos').modal('hide') 
        this.listarId(this._id) 
      }
      
                                
    })

  }

  selectedFile:File | null = null
  OpenFileSelected(event:any){
    this.nombrearchivo = event.target.files[0].name
    console.log(this.nombrearchivo)
    this.selectedFile = event.target.files[0]
  }

  onUpload(){
    if(this.selectedFile){
      this.peticion.Upload(this.selectedFile,"/api/subiravatar/" + this.IdSeleccionado).subscribe((res:any) => {
        console.log(res)
        this.random = Math.random() * (9999 - 0) + 0;
  
        if (res.state == false){
  
          Swal.fire({
            title: "Ouch!",
            text: res.mensaje, // Esta es la respuesta que viene del servidor
            icon: "error"//icono se puede cabiar en base a los iconos de sweep alaert
          });
        }
        else{
          Swal.fire({
            title: "Que bien!",
            text: res.mensaje, // Esta es la respuesta que viene del servidor
            icon: "success"//icono se puede cabiar en base a los iconos de sweep alaert
          });
          this.nombrearchivo = "Archivo cargado"
  
        }
        
  
      })
    }
  } 

}
