import { Mascota } from '../../models/mascota.model';
import { ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MascotaService } from '../../servicios/mascota.service';
import { Observer, Subscription } from 'rxjs';
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
  @Input() mascota!: Mascota;
  @Output() verMas: EventEmitter<string> = new EventEmitter<string>();

  private mascotaService = inject(MascotaService);
  mascotas: Mascota[] = []; // Lista completa de mascotas
  mascotasVisibles: Mascota[] = []; // Mascotas mostradas en tarjetas
  cantidadTarjetas: number = 5; // Número de tarjetas visibles
  intervaloRotacion = 5000; // Tiempo en milisegundos
  private intervaloId: any = null;
  private router = inject(Router);
  private subscription: Subscription = new Subscription();

  constructor(private cdr: ChangeDetectorRef) {} // Inyectamos ChangeDetectorRef

  ngOnInit(): void {
    this.cargarMascotas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mascota']) {
      // Aquí se pueden hacer acciones si 'mascota' cambia
      this.cargarMascotas();
    }
  }

  onVerMas(idMascota: string | undefined): void {
    if (!idMascota) {
      return;
    }
    this.verMas.emit(idMascota);
    this.router.navigate([`detalle/${idMascota}`]);
  }

  cargarMascotas() {
    const observer: Observer<Mascota[]> = {
      next: (mascotas) => {
        if (!Array.isArray(mascotas) || mascotas.length === 0) {
          return;
        }
        // Excluimos la mascota que está en el detalle de las tarjetas
        const mascotasSinDetalle = mascotas.filter(mascota => mascota._id !== this.idMascotaActual);
  
        this.mascotas = mascotasSinDetalle;
  
        // Verifica que la lista de mascotas no esté vacía
        if (this.mascotas.length > 0) {
          this.mascotasVisibles = this.mascotas.slice(0, this.cantidadTarjetas);
          this.iniciarRotacion();
        } else {
          console.log("No hay mascotas visibles.");
        }
  
        // Forzamos la detección de cambios después de actualizar la lista
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error al cargar las mascotas:", error);
      },
      complete: () => {
      }
    };
  
    this.mascotaService.getMascotas().subscribe(observer);
  }

  mezclarArray(array: Mascota[]): Mascota[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  iniciarRotacion(): void {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
    }

    // Asegúrate de que la lista de mascotas tenga suficientes elementos
    if (this.mascotas.length <= this.cantidadTarjetas) {
      this.mascotasVisibles = [...this.mascotas];
      return;
    }

    this.intervaloId = setInterval(() => {
      this.actualizarTarjetas();
    }, this.intervaloRotacion);
  }

  actualizarTarjetas(): void {
    // Verificar si hay suficientes mascotas para la rotación
    if (this.mascotas.length <= this.cantidadTarjetas) {
      this.mascotasVisibles = [...this.mascotas];
      return;
    }

    // Rotar la lista sin modificar `this.mascotas`
    this.mascotas.push(this.mascotas.shift()!);
    this.mascotasVisibles = this.mascotas.slice(0, this.cantidadTarjetas);
    
    // Llamamos a detectChanges para asegurarnos que Angular actualice la vista
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
    }
    this.subscription.unsubscribe();
  }
}