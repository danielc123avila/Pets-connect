import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MascotaService } from '../../servicios/mascota.service';
import { Mascota } from '../../models/mascota.model';
import { EncabezadoComponent } from '../../componentes/encabezado/encabezado.component';
import { PieDePaginaComponent } from '../../componentes/pie-de-pagina/pie-de-pagina.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-lista-mascotas',
  templateUrl: './lista-mascotas.component.html',
  styleUrls: ['./lista-mascotas.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EncabezadoComponent,
    PieDePaginaComponent,
  ],
  standalone: true
})
export class ListaMascotasComponent implements OnInit {
  mascotas: Mascota[] = [];
  mascotasFiltradas: Mascota[] = [];
  cargando: boolean = true;
  error: string | null = null;

  // Opciones para los filtros
  especies: string[] = ['Perro', 'Gato', 'Otro'];
  sexos: string[] = ['Macho', 'Hembra', 'Desconocido'];
  colores: string[] = ['negro', 'blanco', 'gris', 'marron', 'amarillo-beige', 'multicolor', 'otro'];
  estados: string[] = ['Perdido', 'Encontrado', 'en adopcion'];

  // Formulario de filtros
  filtrosForm = new FormGroup({
    especie: new FormControl(''),
    sexo: new FormControl(''),
    ultimaUbicacion: new FormControl(''),
    fechaDesde: new FormControl(''),
    fechaHasta: new FormControl(''),
    color: new FormControl(''),
    estado: new FormControl(''),
    palabrasClave: new FormControl('')
  });

  constructor(
    private mascotaService: MascotaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarMascotas();

    // Suscribirse a cambios en el formulario para filtrar
    this.filtrosForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.aplicarFiltros();
      });
  }

  cargarMascotas(): void {
    this.cargando = true;
    this.mascotaService.getMascotas().subscribe(
      (mascotas) => {
        this.mascotas = mascotas;
        this.mascotasFiltradas = [...mascotas];
        this.cargando = false;
      },
      (error) => {
        console.error('Error al cargar mascotas:', error);
        this.error = 'No se pudieron cargar las mascotas. Por favor, intenta nuevamente.';
        this.cargando = false;
      }
    );
  }

  aplicarFiltros(): void {
    const filtros = this.filtrosForm.value;

    this.mascotasFiltradas = this.mascotas.filter(mascota => {
      // Filtro por especie
      if (filtros.especie && mascota.especie !== filtros.especie) {
        return false;
      }

      // Filtro por sexo
      if (filtros.sexo && mascota.sexo !== filtros.sexo) {
        return false;
      }

      // Filtro por ubicación (contiene el texto)
      if (filtros.ultimaUbicacion && !mascota.ultimaUbicacion.toLowerCase().includes(filtros.ultimaUbicacion.toLowerCase())) {
        return false;
      }

      // Filtro por fecha desde
      if (filtros.fechaDesde) {
        const fechaDesde = new Date(filtros.fechaDesde);
        const fechaMascota = new Date(mascota.fechaExtravio);
        if (fechaMascota < fechaDesde) {
          return false;
        }
      }

      // Filtro por fecha hasta
      if (filtros.fechaHasta) {
        const fechaHasta = new Date(filtros.fechaHasta);
        const fechaMascota = new Date(mascota.fechaExtravio);
        if (fechaMascota > fechaHasta) {
          return false;
        }
      }

      // Filtro por color
      if (filtros.color && mascota.color !== filtros.color) {
        return false;
      }

      // Filtro por estado
      if (filtros.estado && mascota.estado !== filtros.estado) {
        return false;
      }

      // Filtro por palabras clave
      if (filtros.palabrasClave) {
        const palabrasInput = filtros.palabrasClave.toLowerCase().split(',').map(p => p.trim());
        const coincide = palabrasInput.some(palabra =>
          mascota.palabrasClave?.some(p => p.toLowerCase().includes(palabra))
        );
        if (!coincide) {
          return false;
        }
      }

      return true;
    });
  }

  limpiarFiltros(): void {
    this.filtrosForm.reset();
    this.mascotasFiltradas = [...this.mascotas];
  }

  verDetalleMascota(id: any): void {
    this.router.navigate(['/detalle', id]);
  }

  getFotoUrl(mascota: Mascota): string {
    const baseUrl = 'http://localhost:3000';
    if (mascota.fotos && mascota.fotos.length > 0) {
        return baseUrl + mascota.fotos[0].url;
    }
    return '/assets/placeholder-mascota.jpg';
}

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString();
  }
}
