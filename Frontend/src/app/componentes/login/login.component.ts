import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PeticionService } from '../../servicios/peticionservice.service';
import Swal from 'sweetalert2';

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
  
    
  }

  login(){
    
    let data = {
    host:this.peticion.urlHost,
    path:"/api/usuarios/login", //este path viene del backend
    payload:{
     email:this.email,
     password:this.password


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


        Swal.fire({
          title: "Que bien!",
          text: res.mensaje, // Esta es la respuesta que viene del servidor
          icon: "success"//icono se puede cabiar en base a los iconos de sweep alaert
        });
      }
                               
    })
   //     cierre peticion

  }
  
  
}