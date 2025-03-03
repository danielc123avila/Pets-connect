import { Mascota } from '../../models/mascota.model';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MascotaService } from '../../servicios/mascota.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pets-cards',
  imports: [CommonModule, FormsModule],
  templateUrl: './pets-cards.component.html',
  styleUrl: './pets-cards.component.css'
})
export class PetsCardsComponent implements OnInit, OnDestroy {
  @Input() idMascotaActual: string | null = null;

  private mascotaService = inject(MascotaService);
  mascotas: Mascota[] = []; // Lista completa de mascotas
  mascotasVisibles: Mascota[] = []; // Mascotas mostradas en tarjetas
  cantidadTarjetas: number = 5; // Número de tarjetas visibles
  intervaloRotacion = 5000; // Tiempo en milisegundos
  private intervaloId: any = null;
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    console.log('ID recibido en pets-cards:', this.idMascotaActual);
    this.cargarMascotas();
  }

  cargarMascotas() {
    this.mascotaService.getMascotas().subscribe((mascotas) => {
      console.log("Datos recibidos de la API:", mascotas);

      this.mascotas = mascotas.filter((m) => m.especie === "Perro");

      console.log("Mascotas después de filtrar:", this.mascotas);

      if (this.mascotas.length === 0) {
        console.warn("Advertencia: No hay mascotas para mostrar después de filtrar.");
        return;
      }

      // Mezclar antes de mostrar las primeras tarjetas
      this.mascotas = this.mezclarArray(this.mascotas);

      // Llenar `mascotasVisibles` con las primeras N tarjetas
      this.mascotasVisibles = this.mascotas.slice(0, this.cantidadTarjetas);

      // Iniciar la rotación si hay más mascotas que `cantidadTarjetas`
      if (this.mascotas.length > this.cantidadTarjetas) {
        this.iniciarRotacion();
      }
    });
  }

  mezclarArray(array: Mascota[]): Mascota[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  iniciarRotacion(): void {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
    }

    if (this.mascotas.length <= this.cantidadTarjetas) {
      return;
    }

    this.intervaloId = setInterval(() => {
      this.actualizarTarjetas();
    }, this.intervaloRotacion);
  }

  actualizarTarjetas(): void {
    if (this.mascotas.length <= this.cantidadTarjetas) {
      this.mascotasVisibles = [...this.mascotas];
      return;
    }

    // Rotar la lista sin modificar `this.mascotas`
    this.mascotas.push(this.mascotas.shift()!);
    this.mascotasVisibles = this.mascotas.slice(0, this.cantidadTarjetas);

    console.log('Mascotas visibles actualizadas:', this.mascotasVisibles);
  }

  ngOnDestroy(): void {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
    }
    this.subscription.unsubscribe();
  }
}
