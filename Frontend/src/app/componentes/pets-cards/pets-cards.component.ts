import { Mascota } from '../../models/mascota.model';
import { Component, inject, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MascotaService } from '../../servicios/mascota.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pets-cards',
  imports: [CommonModule, FormsModule],
  templateUrl: './pets-cards.component.html',
  styleUrl: './pets-cards.component.css'
})
export class PetsCardsComponent implements OnInit, OnDestroy {
  @Input() idMascotaActual: string | null = null;
  @Input() mascota!: Mascota // ID de la mascota en detalle
  @Output() verMas = new EventEmitter<string>();

  private mascotaService = inject(MascotaService);
  mascotas: Mascota[] = []; // Lista completa de mascotas
  mascotasVisibles: Mascota[] = []; // Mascotas mostradas en tarjetas
  cantidadTarjetas: number = 5; // Número de tarjetas visibles
  intervaloRotacion = 5000; // Tiempo en milisegundos
  private intervaloId: any = null;
  private router = inject(Router);
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    console.log("PetsCardsComponent se ha inicializado");
    this.cargarMascotas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idMascotaActual'] && !changes['idMascotaActual'].firstChange) {
      this.filtrarMascotas(); // Actualiza la lista si cambia la mascota actual
    }
  }

  onVerMas(mascota: Mascota): void {
    if (!mascota || !mascota._id) {
      console.error("La mascota no está definida o no tiene _id.");
      return;
    }

    this.verMas.emit(mascota._id);
    this.router.navigate([`/detalle/${mascota._id}`]);
  }

  cargarMascotas() {
    this.mascotaService.getMascotas().subscribe((mascotas) => {
      this.mascotas = mascotas.filter((m) => m.especie);
      this.filtrarMascotas(); // Filtra las mascotas al cargarlas
    });
  }

  filtrarMascotas(): void {
    // Filtrar la lista para excluir la mascota actual en `DetailComponent`
    this.mascotasVisibles = this.mascotas
      .filter(mascota => mascota._id !== this.idMascotaActual)
      .slice(0, this.cantidadTarjetas);
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
    if (this.mascotasVisibles.length <= this.cantidadTarjetas) {
      return;
    }

    this.mascotasVisibles.push(this.mascotasVisibles.shift()!);
  }

  ngOnDestroy(): void {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
    }
    this.subscription.unsubscribe();
  }
}
