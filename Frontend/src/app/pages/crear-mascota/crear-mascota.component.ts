import { ChangeDetectorRef, Component } from '@angular/core';
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
import { EncabezadoComponent } from '../../componentes/encabezado/encabezado.component';
import { PieDePaginaComponent } from '../../componentes/pie-de-pagina/pie-de-pagina.component';

@Component({
  selector: 'app-crear-mascota',
  templateUrl: './crear-mascota.component.html',
  styleUrls: ['./crear-mascota.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EncabezadoComponent,
    PieDePaginaComponent,
  ],
})
export class CrearMascotaComponent {
  registerMascota: FormGroup;

  selectedEspecie: string | null = null;
  selectedSexo: string | null = null;
  selectedColor: string | null = null;
  selectedEstado: string | null = null;

  estados: string[] = ['Encontrado', 'en adopcion', 'Perdido'];
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

  fotos: {file: File; preview: string}[] = [];
  Error: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private dialog: MatDialog,
    private mascotaService: MascotaService,
    private router: Router,
    private cdr: ChangeDetectorRef
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
    // Convertir primera letra a mayúscula para coincidir con el modelo
    const especieCapitalized =
      especie.charAt(0).toUpperCase() + especie.slice(1);
    this.selectedEspecie = especieCapitalized;
    this.registerMascota.get('especie')?.setValue(especieCapitalized);
  }

  selectSexo(sexo: string) {
    // Convertir primera letra a mayúscula para coincidir con el modelo
    const sexoCapitalized = sexo.charAt(0).toUpperCase() + sexo.slice(1);
    this.selectedSexo = sexoCapitalized;
    this.registerMascota.get('sexo')?.setValue(sexoCapitalized);
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
    console.log("abriendo el selector de archivos...")
    document.getElementById('fileInput')?.click();
  }

  // Método para manejar la selección de archivos
  onFileSelected(event: any) {
    console.log("Evento de selección de archivos detectado", event);
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.warn("No se seleccionaron archivos.");
      return;
    }
    for (let i = 0; i < files.length; i++) {
      if (this.fotos.length < 3) {
        const file = files[i];
        console.log("Archivo seleccionado:", file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          console.log("Cargando imagen en preview...");
          this.fotos.push({ file, preview: e.target.result });
        
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removePhoto(index: number) {
    this.fotos.splice(index, 1);
  }

  // Método para convertir los datos a FormData
  toformData(formValue: any) {
    const formData = new FormData();
    for (const key in formValue) {
      if (formValue.hasOwnProperty(key) && formValue[key] !== null) {
        formData.append(key, formValue[key]);
      }
    }
    this.fotos.forEach((foto) => {
      formData.append("fotos", foto.file)
    });
    return formData
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
              (response) => {},
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
