import { Component, OnInit } from '@angular/core';
import { PeticionService } from '../../servicios/peticionservice.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule,],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit{
  constructor (public peticion:PeticionService, private router:Router){}
  ngOnInit(): void {
    this.status()
  }

  nombre:string = "Cargando..."
  rol:string = "Cargando..."
  ultimologin:string ="1900/01/01"
  _id:string = ""
  

  status(){
    let data = {
      host:this.peticion.urlHost,
      path:"/api/status", //este path viene del backend
      payload:{}
    }
  
    this.peticion.post(data.host + data.path,data.payload).then((res:any) => {
      console.log(res)
      if (res.nombre == undefined || res.nombre == null){
        this.router.navigate(["/"])
      }
      this.nombre = res.nombre
      this.ultimologin = res.ultimologin
      this._id = res._id
    
      //Switch
     switch (res.rol) {
      case "0":
        this.rol = "Cliente"
      break;
      case "1":
        this.rol = "Administrador"
      break;

      default:
      break;
      }
    })
   
      
  }  

  logout (){
    
    let data = {
      host:this.peticion.urlHost,
      path:"/api/logout", //este path viene del backend
      payload:{}
     
    
    }
    this.peticion.post(data.host + data.path,data.payload).then((res:any) => {
      console.log(res)
      if(res.state == true){

        Swal.fire({
          title: "Que bien!",
          text: res.mensaje, // Esta es la respuesta que viene del servidor
          icon: "success"//icono se puede cabiar en base a los iconos de sweep alaert
        });
        this. router.navigate (["/"])

      }
      

    })
      
  }

}
