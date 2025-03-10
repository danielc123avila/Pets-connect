import { Component, OnInit } from '@angular/core';
import { PeticionService } from '../../servicios/peticionservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DashboardComponent } from "../dashboard/dashboard.component";
import { FiltrosPipe } from '../../pipe/filtros.pipe';
declare var $:any 

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule, DashboardComponent, FiltrosPipe],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  
  constructor(public peticion:PeticionService){}

  filtros:string =""
  datos:any [] = []
  nombre:string=""
  email:string=""
  telefono : number = 0
  password:string=""
  IdSeleccionado:string=""
  estado:string = "1"
  rol:string = ""
  random:number = 0
  _id:string = ""
  
  ngOnInit(): void {
    this.listar()
  }

  Nuevo(){
    
    $('#formdatos').modal('show')
    this.nombre = ""
    this.email = ""
    this.rol = ""
    this.telefono = 0
    this.password = ""
    this.IdSeleccionado =""
    this.estado = "1"
  }


  listar(){
    let data = 
    {
     host:this.peticion.urlHost,
     path:"/api/usuarios/listar", 
     payload:{
     }
    }

    this.peticion.post(data.host + data.path,data.payload).then((res:any) => {
      console.log(res)
      this.datos = res.datos                     
    })
   

  }

  guardar(){
    let data = 
    {
     host:this.peticion.urlHost,
     path:"/api/usuarios/guardar", 
     payload:{ 
      nombre: this.nombre,
      email: this.email,
      telefono : this.telefono,
      password: this.password,
      rol:this.rol,
      estado:this.estado

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
        $('#formdatos').modal('hide') 
        this.listar() 
      }
                               
    })

  }

  EditarId(id:string){
    this.IdSeleccionado = id 
    let data = 
    {
     host:this.peticion.urlHost,
     path:"/api/usuarios/listarId", 
     payload:{
      _id:id
     }
    }

    this.peticion.post(data.host + data.path,data.payload).then((res:any) => {
      console.log(res)
      $('#formdatos').modal('show')
      this.nombre = res.datos[0].nombre
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
        $('#formdatos').modal('hide') 
        this.listar() 
      }
      
                               
    })

  }

  eliminar(){
    let data = 
    {
     host:this.peticion.urlHost,
     path:"/api/usuarios/eliminar",
     payload:{
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
        $('#formdatos').modal('hide') 
        this.listar() 
      }
      
                               
    })
  }

}
