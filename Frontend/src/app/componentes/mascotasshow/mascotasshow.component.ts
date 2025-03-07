import { Component, OnInit } from '@angular/core';
import { PeticionService } from '../../servicios/peticionservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DashboardComponent } from "../dashboard/dashboard.component";
import Swal from 'sweetalert2';


declare var $:any


@Component({
  selector: 'app-mascotasshow',
  imports: [CommonModule, FormsModule, DashboardComponent],
  templateUrl: './mascotasshow.component.html',
  styleUrl: './mascotasshow.component.css'
})
export class MascotasshowComponent implements OnInit {

  constructor(public peticion:PeticionService, private router:Router){}

  datos: any[] = []
  nombre: string = ""
  especie: string = ""
  sexo: string = ""
  color: string = ""
  raza: string = ""
  fechaExtravio: string = ""
  email: string = ""
  celular: number = 0;
  ultimaUbicacion: string = ""
  descripcion: string = ""
  estado: string = "perdido"
  imagen: string = "assets/noimagen.jpg"
  IdSeleccionado: string = ""
  random:number = 0
  nombrearchivo:string = "Upload"

  ngOnInit(): void {
  this.listar()
  }

    Nuevo() {
    $('.formdatos').modal('show');
    this.nombre = "";
    this.especie = "";
    this.sexo = "";
    this.color = "";
    this.raza = "";
    this.fechaExtravio = "";
    this.email = "";
    this.celular = 0;
    this.ultimaUbicacion = "";
    this.descripcion = "";
    this.estado = "perdido";
    this.imagen = "assets/noimagen.jpg";
    this.IdSeleccionado = "";
    }

   listar(){
        let data = {
            host: this.peticion.urlHost,
            path: "/api/mascotas/listar",
            payload: {}
        };

        this.peticion.post(data.host + data.path, data.payload).then((res: any) => {
            console.log(res);
            this.datos = res.datos;
        });
    }



   guardar() {
        let data = {
            host: this.peticion.urlHost,
            path: "/api/mascotas/guardar",
            payload: {
                nombre: this.nombre,
                especie: this.especie,
                sexo: this.sexo,
                color: this.color,
                raza: this.raza,
                fechaExtravio: this.fechaExtravio,
                email: this.email,
                celular: this.celular,
                ultimaUbicacion: this.ultimaUbicacion,
                descripcion: this.descripcion,
                estado: this.estado,
                imagen: this.imagen
            }
        };

        this.peticion.post(data.host + data.path, data.payload).then((res: any) => {
            console.log(res);
            if (res.state == false) {
                Swal.fire({
                    title: "Ouch!",
                    text: res.mensaje,
                    icon: "error"
                });
            }else {
                Swal.fire({
                    title: "¡Genial!",
                    text: res.mensaje,
                    icon: "success"
                });
                $('.formdatos').modal('hide');
                this.listar();
            }
        });
    }

    EditarId(id: string) {
        this.IdSeleccionado = id;
        let data = {
            host: this.peticion.urlHost,
            path: "/api/mascotas/listarId",
            payload: { _id: id }
        };

        this.peticion.post(data.host + data.path, data.payload).then((res: any) => {
            console.log(res);
            $('.formdatos').modal('show');
            this.nombre = res.datos[0].nombre;
            this.especie = res.datos[0].especie;
            this.sexo = res.datos[0].sexo;
            this.color = res.datos[0].color;
            this.raza = res.datos[0].raza;
            this.fechaExtravio = res.datos[0].fechaExtravio;
            this.email = res.datos[0].email;
            this.celular = res.datos[0].celular;
            this.ultimaUbicacion = res.datos[0].ultimaUbicacion;
            this.descripcion = res.datos[0].descripcion;
            this.estado = res.datos[0].estado;
            this.imagen = res.datos[0].imagen;
        });
    }

    actualizar() {
        let data = {
            host: this.peticion.urlHost,
            path: "/api/mascotas/actualizar",
            payload: {
                _id: this.IdSeleccionado,
                nombre: this.nombre,
                especie: this.especie,
                sexo: this.sexo,
                color: this.color,
                raza: this.raza,
                fechaExtravio: this.fechaExtravio,
                email: this.email,
                celular: this.celular,
                ultimaUbicacion: this.ultimaUbicacion,
                descripcion: this.descripcion,
                estado: this.estado,
                imagen: this.imagen
            }
        };

        this.peticion.post(data.host + data.path, data.payload).then((res: any) => {
            console.log(res);
            if (res.state == false) {
                Swal.fire({
                    title: "Ouch!",
                    text: res.mensaje,
                    icon: "error"
                });
            } else {
                Swal.fire({
                    title: "¡Genial!",
                    text: res.mensaje,
                    icon: "success"
                });
                $('.formdatosm').modal('hide');
                this.listar();
            }
        });
    }

    eliminar() {
        let data = {
            host: this.peticion.urlHost,
            path: "/api/mascotas/eliminar",
            payload: { _id: this.IdSeleccionado }
        };

        this.peticion.post(data.host + data.path, data.payload).then((res: any) => {
        console.log(res);
        if (res.state == false) {
            Swal.fire({
            title: "Ouch!",
            text: res.mensaje,
            icon: "error"
            });
        } else {
            Swal.fire({
                title: "¡Genial!",
                text: res.mensaje,
                icon: "success"
            });
            $('#formdatosm').modal('hide');
            this.listar();
        }
        });
    }

    selectedFile:File | null = null
    OpenFileSelected(event:any){
      this.nombrearchivo = event.target.files[0].name
      console.log(this.nombrearchivo)
      this.selectedFile = event.target.files[0]
    }

    onUpload(){
        if(this.selectedFile){
          this.peticion.Upload(this.selectedFile,"/subirmascotas/" + this.IdSeleccionado).subscribe((res:any) => {
            console.log(res)
            this.random = Math.random() * (9999 - 0) + 0;

            if (res.state == false){

              Swal.fire({
                title: "Ouch!",
                text: res.mensaje, // Esta es la respuesta que viene del servidor
                icon: "error"//icono se puede cabiar en base a los iconos de sweep alaert
              });
            }
            else{
              Swal.fire({
                title: "Que bien!",
                text: res.mensaje, // Esta es la respuesta que viene del servidor
                icon: "success"//icono se puede cabiar en base a los iconos de sweep alaert
              });
              this.nombrearchivo = "Archivo cargado"

            }


          })
        }
    }


}
