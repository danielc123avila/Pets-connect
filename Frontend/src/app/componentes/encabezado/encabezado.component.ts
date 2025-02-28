import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PeticionService } from '../../servicios/peticionservice.service';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from "../login/login.component";
import { AuthService } from '../../authservice/auth.service';
import Swal from 'sweetalert2';
import { RegistroComponent } from "../registro/registro.component";





@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule, LoginComponent, RegistroComponent],
  templateUrl: './encabezado.component.html',
  styleUrl: './encabezado.component.css'
})
export class EncabezadoComponent implements OnInit {
  
  nombre:string = ""
  rol:string = ""
  _id:string = ""
  isAuthenticated: boolean = false
  isLoading: boolean = true

  constructor (public peticion:PeticionService, private router:Router, private cdr: ChangeDetectorRef, private authservice: AuthService){}
  ngOnInit(): void {
    //this.status()
    // Suscríbete al observable para detectar cambios
    this.authservice.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      console.log("Estado de autenticación:", this.isAuthenticated)
      
    })

    this.authservice.isLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading
      this.isLoading = false
    })
  }

  showLogin = false
  openLogin() {
    this.showLogin = true
  }
  closeLogin() {
    this.showLogin = false
  }

  showRegistro = false
  openRegistro() {
    this.showRegistro = true
  }
  closeRegistro() {
    this.showRegistro = false
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
        this.authservice.setAuthenticationStatus(false)
        this.rol = ""
        this. router.navigate (["/"])
      }

    })
  }
}

