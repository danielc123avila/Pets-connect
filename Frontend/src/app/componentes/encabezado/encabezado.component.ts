import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PeticionService } from '../../servicios/peticionservice.service';
@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './encabezado.component.html',
  styleUrl: './encabezado.component.css'
})
export class EncabezadoComponent {

  constructor (public peticion:PeticionService, private router:Router){}
  ngOnInit(): void {
    this.status()
  }

  nombre:string = "Cargando..."
  rol:string = "Cargando..."
  ultimologin:string ="1900/01/01"
  _id:string = ""
  random:number = 0

  status(){
    let data = {
      host:this.peticion.urlHost,
      path:"/api/status", //este path viene del backend
      payload:{}
    }
  
    this.peticion.post(data.host + data.path,data.payload).then((res:any) => {
      console.log(res)
      if (res.nombre == undefined || res.nombre == null){
        this.router.navigate(["login"])
      }
      this.nombre = res.nombre
      this.ultimologin = res.ultimologin
      this._id = res._id
    
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

}
