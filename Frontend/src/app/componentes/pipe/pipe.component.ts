import { Component, HostListener } from '@angular/core';
import { PeticionService } from '../../servicios/peticionservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltrosPipe } from '../../pipe/filtros.pipe';
import Swal from 'sweetalert2';
declare var $:any 

@Component({
  selector: 'app-pipe',
  imports: [CommonModule, FormsModule, FiltrosPipe],
  templateUrl: './pipe.component.html',
  styleUrl: './pipe.component.css'
})
export class PipeComponent {
  constructor(public peticion:PeticionService){}
  
  filtros :string = ""
  datos:any [] = []
  nombre:string=""
  email:string=""
  telefono : number = 0
  password:string=""
  IdSeleccionado:string=""
  estado:string = "1"
  rol:string = ""
  random:number = 0
  _id:string = ""
  
  ngOnInit(): void {
    this.listar()
  }

  dropdownOpen = false;
  selectedLetter: string | null = null;
  
  letras = ['J', 'l']; // Opciones de letras a seleccionar

  datosFiltrados = [...this.datos];

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectLetter(letter: string) {
    this.selectedLetter = letter;
    this.dropdownOpen = false;
    
    // Filtrar nombres según la letra seleccionada
    this.datosFiltrados = this.datos.filter(item => item.nombre.startsWith(letter));
  }

  // Cierra el dropdown si se hace clic fuera
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.dropdownOpen = false;
    }
  }

  Nuevo(){
    
    $('#formdatos').modal('show')
    this.nombre = ""
    this.email = ""
    this.rol = ""
    this.telefono = 0
    this.password = ""
    this.IdSeleccionado =""
    this.estado = "1"
  }


  listar(){
    let data = 
    {
    host:this.peticion.urlHost,
    path:"/api/usuarios/listar", 
    payload:{
    }
    }

    this.peticion.post(data.host + data.path,data.payload).then((res:any) => {
      console.log(res)
      this.datos = res.datos                     
    })
  

  }

  guardar(){
    let data = 
    {
    host:this.peticion.urlHost,
    path:"/api/usuarios/guardar", 
    payload:{ 
      nombre: this.nombre,
      email: this.email,
      telefono : this.telefono,
      password: this.password,
      rol:this.rol,
      estado:this.estado

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
        Swal.fire({
          title: "Que bien!",
          text: res.mensaje,
          icon: "success"
        });
        $('#formdatos').modal('hide') 
        this.listar() 
      }
                              
    })

  }

  EditarId(id:string){
    this.IdSeleccionado = id 
    let data = 
    {
    host:this.peticion.urlHost,
    path:"/api/usuarios/listarId", 
    payload:{
      _id:id
    }
    }

    this.peticion.post(data.host + data.path,data.payload).then((res:any) => {
      console.log(res)
      $('#formdatos').modal('show')
      this.nombre = res.datos[0].nombre
      this.email = res.datos[0].email
      this.telefono = res.datos[0].telefono
      this.rol = res.datos[0].rol
      this.estado = res.datos[0].estado
      
                              
    })
    
  }

  actualizar (){

    let data = 
    {
    host:this.peticion.urlHost,
    path:"/api/usuarios/actualizar", 
    payload:{
      nombre:this.nombre,
      telefono:this.telefono,
      rol:this.rol,
      estado:this.estado,
      _id:this.IdSeleccionado
      
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
        Swal.fire({
          title: "Que bien!",
          text: res.mensaje,
          icon: "success"
        });
        $('#formdatos').modal('hide') 
        this.listar() 
      }
      
                              
    })

  }

  eliminar(){
    let data = 
    {
    host:this.peticion.urlHost,
    path:"/api/usuarios/eliminar",
    payload:{
      _id:this.IdSeleccionado
      
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
        Swal.fire({
          title: "Que bien!",
          text: res.mensaje,
          icon: "success"
        });
        $('#formdatos').modal('hide') 
        this.listar() 
      }
      
                              
    })
  }
}
