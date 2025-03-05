import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PeticionService } from '../../servicios/peticionservice.service';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule],
  templateUrl: './encabezado.component.html',
  styleUrl: './encabezado.component.css'
})
export class EncabezadoComponent implements OnInit {
  
  nombre:string = ""
  rol:string = ""
  _id:string = ""
  isLoading: boolean = true

  constructor (public peticion:PeticionService, private router:Router, private cdr: ChangeDetectorRef){}
  ngOnInit(): void {
    this.status()
  }


  status() {
    let data = {
      host: this.peticion.urlHost,
      path: "/api/status",
      payload: {}
    };

    this.isLoading = true; // Activar el estado de carga
    this.peticion.post(data.host + data.path, data.payload).then((res: any) => {

      // Asignar el rol
      switch (res.rol) {
        case "0":
          this.rol = "Cliente";
          break;
        case "1":
          this.rol = "Administrador";
          break;
        default:
          this.rol = "";
          break;
      }

      this.isLoading = false; // Desactivar el estado de carga
    }).catch((error) => {
      console.error("Error en la petición de status:", error);
      this.isLoading = false; // Desactivar el estado de carga en caso de error
    });
  }



  logout() {
    let data = {
      host: this.peticion.urlHost,
      path: "/api/logout", // Este path viene del backend
      payload: {}
    };

    this.peticion.post(data.host + data.path, data.payload).then((res: any) => {
      console.log(res);
      if (res.state == true) {
        Swal.fire({
          title: "¡Que bien!",
          text: res.mensaje,
          icon: "success"
        })
        
        this.rol = ""
        this.cdr.detectChanges()
        this. router.navigate (["/"])
      }

    })
  }
}

