import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PeticionService } from '../../servicios/peticionservice.service';
import Swal from 'sweetalert2';
declare var localStorage: any

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit{
  constructor(private peticion: PeticionService, private router:Router){}

  email:any = ""
  password:any = ""
  recordar:boolean = false

  ngOnInit(): void {
    this.recordar = localStorage.getItem("recordar") == "true" ? true : false

    if (this.recordar == true){
      this.email = localStorage.getItem("email")?.toString()
      this.password = localStorage.getItem("pass")?.toString()  
    }
    this.inicializarGoogle();
  }


  inicializarGoogle() {  
    // Definir la función global para manejar la respuesta de Google
    (window as any).handleCredentialResponse = (response: any) => {  
      const token = response.credential;  

      const data = {  
        host: this.peticion.urlHost,  
        path: "/api/usuarios/loginGoogle", // Ruta para el backend  
        payload: { token }  
      };

      this.peticion.post(data.host + data.path, data.payload)  
        .then((res: any) => {  
          console.log(res)
          if (res.state === false) {  
            Swal.fire({  
              title: "Ouch!",  
              text: res.mensaje,  
              icon: "error"  
            });  
          } else {  
            localStorage.setItem("recordar", this.recordar.toString())

            if (this.recordar) {  
              localStorage.setItem("email", this.email);  
              localStorage.setItem("pass", this.password);  
            } else {  
              localStorage.setItem("email", "")  
              localStorage.setItem("pass", "")  
            }  

            //GUARDAR USERID Y NOMBRE

            localStorage.setItem("userId", res.userId);

            this.router.navigate(["/dashboard"])  

            Swal.fire({  
              title: "¡Qué bien!",  
              text: res.mensaje,  
              icon: "success"  
            });  
          }  
        })  
        .catch((error: any) => {  
          console.error("Error al autenticar con Google: ", error);
          Swal.fire({  
            title: "Error",  
            text: "Hubo un problema con la autenticación. Por favor, intenta de nuevo.",  
            icon: "error"  
          })
        })
    }

    // Esperar que Google haya cargado su SDK antes de intentar inicializarlo
    setTimeout(() => {
      if ((window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: "33102534882-ul2rja3n7i5t7d84vgro1hfiu7bmaiuj.apps.googleusercontent.com",
          callback: (window as any).handleCredentialResponse,
          auto_select: false,
        });

        (window as any).google.accounts.id.renderButton(
          document.getElementById("buttonDiv"),
          { theme: "outline", size: "large" } // Puedes personalizarlo
        );
      } else {
        console.error("Google API no se ha cargado correctamente.");
      }
    }, 1000);
  }
  
  login(){
    
    let data = {
    host:this.peticion.urlHost,
    path:"/api/usuarios/login",
    payload:{
     email:this.email,
     password:this.password
    }
   }

    this.peticion.post(data.host + data.path,data.payload).then((res:any) => {
      console.log(res)
      if (res.state == false){
        Swal.fire({
          title: "Ouch!",
          text: res.mensaje, 
          icon: "error"
        })
      }
      else {
        localStorage.setItem("recordar",this.recordar.toString())

        if(this.recordar == true){

          localStorage.setItem("email",this.email)
          localStorage.setItem("pass",this.password)
        }
        else {
          localStorage.setItem("email","")
          localStorage.setItem("pass","")
        }

        //GUARDAR USERID Y NOMBRE

        localStorage.setItem("userId", res.userId)

        this.router.navigate(["/"])
        
        Swal.fire({
          title: "Que bien!",
          text: res.mensaje,
          icon: "success"
        });
      }
    })
   
  }
  
  
}