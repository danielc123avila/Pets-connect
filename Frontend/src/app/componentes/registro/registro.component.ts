import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink,} from '@angular/router';
import { PeticionService } from '../../servicios/peticionservice.service';
import { AuthService } from '../../authservice/auth.service';
import Swal from 'sweetalert2';
import { LoginComponent } from "../login/login.component";
declare var localStorage: any

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, LoginComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

  constructor(private peticion: PeticionService, private authservice: AuthService, private  router:Router,
  ){}

  email:any = ""
  password:any = ""
  nombre:string = ""
  confirmar:String = ""

  ngOnInit(): void {
    this.inicializarGoogle();
  }

  @Output() onClose = new EventEmitter<void>(); 
    close() {
    this.onClose.emit();
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
          if (res.state === false) {  
            Swal.fire({  
              title: "Ouch!",  
              text: res.mensaje,  
              icon: "error"  
            });  
          } else {  
            
            this.router.navigate(["/"])  

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

    
    setTimeout(() => {
      if ((window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: "33102534882-ul2rja3n7i5t7d84vgro1hfiu7bmaiuj.apps.googleusercontent.com",
          callback: (window as any).handleCredentialResponse,
          auto_select: false,
        });

        (window as any).google.accounts.id.renderButton(
          document.getElementById("buttonDiv"),
          { theme: "outline", size: "large" } 
        );
      } else {
        console.error("Google API no se ha cargado correctamente.");
      }
    }, 1000);
  }
  
  registrar(){
    let data = {
     host:this.peticion.urlHost,
     path:"/api/usuarios/registro", 
     payload:{
      nombre:this.nombre,
      email:this.email,
      password:this.password

     }
    }
    console.log(data)

    this.peticion.post(data.host + data.path,data.payload).then((res:any)=>{
      console.log(res)
      if (res.state == false){
        
        Swal.fire({
          title: "Ouch!",
          text: res.mensaje,
          icon: "question"
        });

        this.close();  
        this.router.navigate(["/"]);

      }
      else{
        Swal.fire({
          title: "Que bien!",
          text: res.mensaje, 
          icon: "success"
          
        });
        
      }
      
    })
  }
  
}
