import { Mascota } from './../../models/mascota.model';
import { Component, OnInit, signal, Input, inject, WritableSignal, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MascotaService } from '../../servicios/mascota.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PieDePaginaComponent } from '../../componentes/pie-de-pagina/pie-de-pagina.component';
import { EncabezadoComponent } from '../../componentes/encabezado/encabezado.component';
import { PetsCardsComponent } from "../../componentes/pets-cards/pets-cards.component";

@Component({
  selector: 'app-detail',
  imports: [
    FormsModule,
    CommonModule,
    PieDePaginaComponent,
    EncabezadoComponent,
    PetsCardsComponent
],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  // Solo una definición de mascota
  mascota: WritableSignal<Mascota | null> = signal(null);

  //indice actual para el carrousel
  indiceActual: number = 0

  // Input con minúscula inicial para seguir convenciones
  @Input() Mascota: any;
  idMascotaActual: string | null = null;
  id: string | null = null;


  // Servicios inyectados
  private mascotaService = inject(MascotaService);
  private route = inject(ActivatedRoute);
  private cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.mascotaService.getMascotaPorId(this.id).subscribe({
        next: (data) => {
          this.mascota.set(data);
        },
        error: (error) => console.error('Error al obtener mascota:', error)
      });
    }
  }

  actualizarDetalleMascota(id: string): void {
  
    if (!id) {
      return;
    }
  
    this.mascotaService.getMascotaPorId(id).subscribe({
      next: (data) => {
        console.log('🐾 Nueva mascota cargada:', data);
        if (!data || !data._id) {
          console.error('La mascota recibida no tiene _id:', data);
          return;
        }
        this.mascota.set(data); // Actualizar el Signal
        console.log('Mascota después de set:', this.mascota());
        this.cd.markForCheck();
      },
      error: (error) => console.error('Error al obtener mascota:', error)
    });
  }

  anterior(): void {
    const mascotaData = this.mascota();
    if (mascotaData && mascotaData.fotos?.length) {
      this.indiceActual = (this.indiceActual - 1 + mascotaData.fotos.length) % mascotaData.fotos.length;
    }
  }
  
  siguiente(): void {
    const mascotaData = this.mascota();
    if (mascotaData && mascotaData.fotos?.length) {
      this.indiceActual = (this.indiceActual + 1) % mascotaData.fotos.length;
    }
  }
}

