import { Component } from '@angular/core';
import { PeticionService } from '../../servicios/peticionservice.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { EncabezadoComponent } from "../encabezado/encabezado.component";
import { PieDePaginaComponent } from "../pie-de-pagina/pie-de-pagina.component";

@Component({
  selector: 'app-solicitarcodigo',
  imports: [FormsModule, CommonModule, RouterLink, EncabezadoComponent, PieDePaginaComponent],
  templateUrl: './solicitarcodigo.component.html',
  styleUrl: './solicitarcodigo.component.css'
})
export class SolicitarcodigoComponent {
  constructor(private peticion: PeticionService, private router:Router){}
  email:String = ""
  password:String = ""

  solicitar(){

    let data = {
    host:this.peticion.urlHost,
    path:"/api/usuarios/solicitarcodigo", 
    payload:{
     email:this.email,

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
      
        this.router.navigate(["recuperarpass"])

        Swal.fire({
          title: "Que bien!",
          text: res.mensaje, 
          icon: "success"
        });
      }
                               
    })
   

  }
}
