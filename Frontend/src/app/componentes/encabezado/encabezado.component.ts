import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PeticionService } from '../../servicios/peticionservice.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule],
  templateUrl: './encabezado.component.html',
  styleUrl: './encabezado.component.css'
})
export class EncabezadoComponent {

  constructor (public peticion:PeticionService, private router:Router){}
  ngOnInit(): void {
    this.status()
  }

  nombre:string = ""
  rol:string = ""

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
    
      //Switch
     switch (res.rol) {
      case "0":
        this.rol = "Usuario"
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
      path:"/logout", //este path viene del backend
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
        this.status()

      }
      

    })
      
  }

}
