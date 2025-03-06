// crear-mascota.component.ts
import { Component, inject, signal } from '@angular/core';
import { MascotaService } from '../../servicios/mascota.service';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../componentes/modal/modal.component';

@Component({
  selector: 'app-crear-mascota',
  templateUrl: './crear-mascota.component.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./crear-mascota.component.css'],
})
export class CrearMascotaComponent {
  constructor(private dialog: MatDialog) {}

  private mascotaService = inject(MascotaService);
  private router = inject(Router);
  fotos: File | null = null;
  Error = signal('');

  registerMascota = new FormGroup({
    especie: new FormControl('', { validators: [Validators.required] }),
    sexo: new FormControl('', { validators: [Validators.required] }),
    nombre: new FormControl('', { validators: [Validators.required] }),
    ultimaUbicacion: new FormControl('', { validators: [Validators.required] }),
    fechaExtravio: new FormControl('', { validators: [Validators.required] }),
    color: new FormControl('', { validators: [Validators.required] }),
    raza: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', { validators: [Validators.required] }),
    celular: new FormControl('', { validators: [Validators.required] }),
    palabrasClave: new FormControl('', { validators: [Validators.required] }),
    estado: new FormControl('', { validators: [Validators.required] }),
    fotos: new FormControl<File | null>(null),
  });

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fotos = file;
    }
  }

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

  onsubmit() {
    if (this.registerMascota.valid) {
      const dialogRef = this.dialog.open(ModalComponent);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.mascotaService.crearMascota(
            this.toformData(this.registerMascota.value)
          );
        }
      });
    } else {
      this.Error.set('Por favor completa todos los campos obligatorios.');
    }
  }
}
