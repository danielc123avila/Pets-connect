import { Component, OnInit } from '@angular/core';
import { PeticionService } from '../../servicios/peticionservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DashboardComponent } from "../dashboard/dashboard.component";
declare var $:any 

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule, DashboardComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  constructor(private peticion:PeticionService){}

  // la respuesta de la peticion se guarda en el siguiente array
  datos:any [] = []
  // variables de ng que estan en html
  nombre:string=""
  email:string=""
  telefono : number = 0
  password:string=""
  // Aca estamos almacenando el Id, para usarla mas adelante
  IdSeleccionado:string=""
  estado:string = "1"
  rol:string = ""
  
  //soluciona el error de UsuariosComponent
  ngOnInit(): void {
    this.listar()
  }

  Nuevo(){
    //formdatos
    $('#formdatos').modal('show')
    //limpiar la informacion del formulario  
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
     path:"/api/usuarios/listar", //este path viene del backend
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
     path:"/api/usuarios/guardar", //este path viene del backend
     payload:{ // aca estamos asignando los datos
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
        //Acontinuacion estamos importando sweet alerts
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
        $('#formdatos').modal('hide') //cierra el modal cuando se guarde el usuario
        this.listar() //aca le decimos que recargue para listar el usuario 
      }
                               
    })

  }

  EditarId(id:string){
    //Usando la variable Id
    this.IdSeleccionado = id 
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
     path:"/api/usuarios/actualizar", //este path viene del backend
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
        //Acontinuacion estamos importando sweet alerts
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
        $('#formdatos').modal('hide') //cierra el modal cuando se guarde el usuario
        this.listar() //aca le decimos que recargue para listar el usuario 
      }
      
                               
    })

  }

  eliminar(){
    let data = 
    {
     host:this.peticion.urlHost,
     path:"/api/usuarios/eliminar", //este path viene del backend
     payload:{
      _id:this.IdSeleccionado
      
     }
    }

    this.peticion.post(data.host + data.path,data.payload).then((res:any) => {
      console.log(res)
      if (res.state == false){
        //Acontinuacion estamos importando sweet alerts
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
        $('#formdatos').modal('hide') //cierra el modal cuando se guarde el usuario
        this.listar() //aca le decimos que recargue para listar el usuario 
      }
      
                               
    })
  }
}
