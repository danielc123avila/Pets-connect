import { Mascota } from '../../models/mascota.model';
import { Component, inject, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MascotaService } from '../../servicios/mascota.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pets-cards',
  imports: [CommonModule, FormsModule],
  templateUrl: './pets-cards.component.html',
  styleUrl: './pets-cards.component.css'
})
export class PetsCardsComponent implements OnInit, OnDestroy {
  @Input() idMascotaActual: string | null = null;
  @Input() mascota!: Mascota;
  @Output() verMas: EventEmitter<string> = new EventEmitter<string>();

  private mascotaService = inject(MascotaService);
  mascotas: Mascota[] = []; // Lista completa de mascotas
  mascotasVisibles: Mascota[] = []; // Mascotas mostradas en tarjetas
  cantidadTarjetas: number = 5; // Número de tarjetas visibles
  intervaloRotacion = 5000; // Tiempo en milisegundos
  private intervaloId: any = null;
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.cargarMascotas();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mascota']) {
    }
  }

  onVerMas(): void {
    if (!this.mascota || !this.mascota._id) {
      return;
    }
    this.verMas.emit(this.mascota._id);
  }


  cargarMascotas() {
    this.mascotaService.getMascotas().subscribe((mascotas) => {

      this.mascotas = mascotas.filter((m) => m.especie === "Perro");

      if (this.mascotas.length === 0) {
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

  }

  ngOnDestroy(): void {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
    }
    this.subscription.unsubscribe();
  }
}
