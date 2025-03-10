import { Mascota } from './../../models/mascota.model';
import { Component, OnInit, signal, Input, inject, WritableSignal, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotaService } from '../../servicios/mascota.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PieDePaginaComponent } from '../../componentes/pie-de-pagina/pie-de-pagina.component';
import { EncabezadoComponent } from '../../componentes/encabezado/encabezado.component';
import { PetsCardsComponent } from "../../componentes/pets-cards/pets-cards.component";
import { CommentsComponent } from "../../componentes/comments/comments.component";
import { CommentsService } from '../../servicios/comments.service';

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
export class DetailComponent implements OnInit {
  mascota: WritableSignal<Mascota | null> = signal(null);
  indiceActual: number = 0;

  @Input() Mascota: any;
  idMascotaActual: string | null = null;
  id: string | null = null;
  comentarios: any[] = [];

  private mascotaService = inject(MascotaService);
  private route = inject(ActivatedRoute);
  private cd = inject(ChangeDetectorRef);
  private commentService = inject(CommentsService);
  private router = inject(Router)

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.mascotaService.getMascotaPorId(this.id).subscribe({
        next: (data) => {
          if (!data || !data._id) {
            console.error("La mascota recibida no tiene un _id válido:", data);
            return;
          }
          this.mascota.set(data);
          console.log("Mascota cargada correctamente:", this.mascota());
          this.idMascotaActual = data._id;
          this.obtenerComentarios();
        },
        error: (error) => console.error('Error al obtener mascota:', error)
      });
    }
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
    console.log("ID recibido del evento verMas:", id);
    // Asegúrate de que esto se ejecute
    this.router.navigate([`/detalles/${id}`]);
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
