import { Mascota } from './../../models/mascota.model';
import { Component, OnInit, signal, Input, inject, WritableSignal, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotaService } from '../../servicios/mascota.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PieDePaginaComponent } from '../../componentes/pie-de-pagina/pie-de-pagina.component';
import { EncabezadoComponent } from '../../componentes/encabezado/encabezado.component';
import { PetsCardsComponent } from "../../componentes/pets-cards/pets-cards.component";
import { CommentsComponent } from "../../componentes/comments/comments.component";
import { CommentsService } from '../../servicios/comments.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detail',
  imports: [
    FormsModule,
    CommonModule,
    PieDePaginaComponent,
    EncabezadoComponent,
    PetsCardsComponent,
    CommentsComponent
],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit, OnDestroy {
  mascota: WritableSignal<Mascota | null> = signal(null);
  indiceActual: number = 0;
  comentarios: any[] = [];
  private routeSub: Subscription = new Subscription(); // Suscripción para gestionar los cambios

  @Input() Mascota: any;
  idMascotaActual: string | null = null;
  id: string | null = null;

  private mascotaService = inject(MascotaService);
  private route = inject(ActivatedRoute);
  private cd = inject(ChangeDetectorRef);
  private commentService = inject(CommentsService);
  private router = inject(Router)

  ngOnInit(): void {
    // Suscribirse al paramMap para escuchar los cambios en la URL
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.cargarMascotaPorId(this.id);
      }
    });
  }

  ngOnDestroy(): void {
    // Cancelar la suscripción cuando el componente se destruya para evitar fugas de memoria
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  cargarMascotaPorId(id: string): void {
    this.mascotaService.getMascotaPorId(id).subscribe({
      next: (data) => {
        if (!data || !data._id) {
          console.error("La mascota recibida no tiene un _id válido:", data);
          return;
        }
        this.mascota.set(data);
        this.idMascotaActual = data._id;
        this.obtenerComentarios();
      },
      error: (error) => console.error('Error al obtener mascota:', error)
    });
  }

  obtenerComentarios() {
    if (!this.idMascotaActual) {
      console.warn("No se puede obtener los comentarios: idMascotaActual no encontrado");
      return;
    }

    this.commentService.getComments(this.idMascotaActual).subscribe(
      (response) => {
        this.comentarios = response; // Asigna los comentarios a la propiedad
      },
      (error) => {
        console.error("Error al obtener los comentarios", error);
      }
    );
  }

  actualizarDetalleMascota(id: string): void {
    this.router.navigate([`/detalle/${id}`]);
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
