import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { PeticionService } from '../../servicios/peticionservice.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EncabezadoComponent } from "../encabezado/encabezado.component";
import { PieDePaginaComponent } from "../pie-de-pagina/pie-de-pagina.component";


@Component({
  selector: 'app-recuperarpass',
  imports: [FormsModule, CommonModule, EncabezadoComponent, PieDePaginaComponent],
  templateUrl: './recuperarpass.component.html',
  styleUrl: './recuperarpass.component.css'
})
export class RecuperarpassComponent {

  constructor(private peticion: PeticionService, private router:Router){}

  email:String = ""
  password:String = ""
  confirmar:String = ""
  codigo:String =""

  recuperar(){
  
  
    let data = {
    host:this.peticion.urlHost,
    path:"/api/usuarios/recuperarpass", 
    payload:{
      email:this.email,
      password:this.password,
      codigo:this.codigo

    }}

    this.peticion.post(data.host + data.path,data.payload).then((res:any) => {
      console.log(res)
      if (res.state == false){
        Swal.fire({
          title: "Ouch!",
          text: res.mensaje,
          icon: "error"
        })
      }
      else{
        
        this.router.navigate(["login"])

        Swal.fire({
          title: "Que bien!",
          text: res.mensaje, 
          icon: "success"
        });
      }
                               
    })
   

  }

}
