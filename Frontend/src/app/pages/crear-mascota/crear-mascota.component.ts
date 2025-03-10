import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MascotaService } from '../../servicios/mascota.service';
import { Router } from '@angular/router';
import { ModalComponent } from '../../componentes/modal/modal.component';
import { BehaviorSubject } from 'rxjs';
import { PieDePaginaComponent } from "../../componentes/pie-de-pagina/pie-de-pagina.component";
import { EncabezadoComponent } from "../../componentes/encabezado/encabezado.component";

@Component({
  selector: 'app-crear-mascota',
  templateUrl: './crear-mascota.component.html',
  styleUrls: ['./crear-mascota.component.css'],
  imports: [CommonModule, ReactiveFormsModule, PieDePaginaComponent, EncabezadoComponent], // Asegúrate de importar aquí CommonModule y ReactiveFormsModule
})
export class CrearMascotaComponent {
  registerMascota: FormGroup;

  selectedEspecie: string | null = null;
  selectedSexo: string | null = null;
  selectedColor: string | null = null;
  selectedEstado: string | null = null;

  estados: string[] = ['Disponible', 'Adoptado', 'Perdido'];
  palabrasClaves: string[] = [
    'Manchas',
    'Cicatriz',
    'Cola cortada',
    'Orejas caidas',
    'Adulto',
    'Cachorro',
    'Orejas herguidas',
    'Vacunado',
    'Desparacitado',
    'Tratamiento especial',
    'Discapacidad',
    'Pelo corto',
    'Pelo largo',
    'Castrado',
  ];
  selectedPalabras: string[] = [];

  fotos: any;
  Error: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private dialog: MatDialog,
    private mascotaService: MascotaService,
    private router: Router
  ) {
    this.registerMascota = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      especie: new FormControl(null, Validators.required),
      raza: new FormControl(null),
      sexo: new FormControl(null, Validators.required),
      color: new FormControl(null, Validators.required),
      edad: new FormControl(null),
      descripcion: new FormControl(null),
      estado: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      celular: new FormControl(null, [
        Validators.required,
        Validators.pattern('[0-9]{9,10}'),
      ]),
      // Nuevos campos obligatorios
      ultimaUbicacion: new FormControl(null, Validators.required),
      fechaExtravio: new FormControl(null, Validators.required),
    });
  }

  // Métodos para seleccionar opciones
  selectEspecie(especie: string) {
    this.selectedEspecie = especie;
    this.registerMascota.get('especie')?.setValue(especie);
  }

  selectSexo(sexo: string) {
    this.selectedSexo = sexo;
    this.registerMascota.get('sexo')?.setValue(sexo);
  }

  selectColor(color: string) {
    this.selectedColor = color;
    this.registerMascota.get('color')?.setValue(color);
  }

  selectEstado(estado: string) {
    this.selectedEstado = estado;
    this.registerMascota.get('estado')?.setValue(estado);
  }

  // Método para manejar la selección de palabras claves
  togglePalabra(palabra: string) {
    if (this.selectedPalabras.includes(palabra)) {
      this.selectedPalabras = this.selectedPalabras.filter(
        (p) => p !== palabra
      );
    } else {
      this.selectedPalabras.push(palabra);
    }
  }

  // Método para abrir el selector de archivos
  openFileInput() {
    document.getElementById('fileInput')?.click();
  }

  // Método para manejar la selección de archivos
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fotos = file;
      console.log('Archivo seleccionado:', file);
      // Aquí puedes manejar la subida del archivo o mostrarlo en la interfaz
    }
  }

  // Método para convertir los datos a FormData
  toformData(formValue: any) {
    const formData = new FormData();
    for (const key in formValue) {
      if (formValue.hasOwnProperty(key) && formValue[key] !== null) {
        formData.append(key, formValue[key]);
      }
    }
    if (this.fotos) {
      formData.append('fotos', this.fotos);
    }
    console.log(formData.getAll('fotos'));
    return formData;
  }

  // Método para manejar el envío de datos
  onsubmit() {
    if (this.registerMascota.valid) {
      const dialogRef = this.dialog.open(ModalComponent);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const formValue = {
            ...this.registerMascota.value,
            palabrasClaves: this.selectedPalabras.join(', '),
          };

          this.mascotaService
            .crearMascota(this.toformData(formValue))
            .subscribe(
              (response) => {
                console.log('Mascota creada exitosamente:', response);
                // Lógica adicional si es necesario
              },
              (error) => {
                console.error('Error al crear la mascota:', error);
                this.Error.next(
                  'Hubo un error al crear la mascota. Por favor, intenta nuevamente.'
                );
              }
            );
        }
      });
    } else {
      this.Error.next('Por favor completa todos los campos obligatorios.');
    }
  }

  // Método para obtener el mensaje de error
  getErrorMessage() {
    return this.Error.asObservable();
  }
}
