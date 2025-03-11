import { Mascota } from './../../models/mascota.model';
import { Component, OnInit, signal, Input, inject, WritableSignal, ChangeDetectorRef, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotaService } from '../../servicios/mascota.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PieDePaginaComponent } from '../../componentes/pie-de-pagina/pie-de-pagina.component';
import { EncabezadoComponent } from '../../componentes/encabezado/encabezado.component';
import { PetsCardsComponent } from "../../componentes/pets-cards/pets-cards.component";
import { CommentsComponent } from "../../componentes/comments/comments.component";
import { CommentsService } from '../../servicios/comments.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PeticionService } from '../../servicios/peticionservice.service';

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
  mascota: BehaviorSubject<Mascota | null> = new BehaviorSubject<Mascota | null>(null);
  indiceActual: number = 0;

  //AVATAR

  avatarUrl: string = '';
  userId: string = ''

  @Input() Mascota: any;
  idMascotaActual: string | null = null;
  id: string | null = null;
  comentarios: any[] = [];
  @Output() mascotaSeleccionada = new EventEmitter<string>();

  private mascotaService = inject(MascotaService);
  public peticion = inject(PeticionService)
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef); // Corregido
  private commentService = inject(CommentsService);
  private router = inject(Router);
  private paramMapSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.paramMapSubscription = this.route.paramMap.subscribe(params => {
      this.id = params.get('id'); // Extrae el id de la URL dinámicamente
      console.log("ID extraído de la ruta:", this.id);
      this.cargarMascota(); // Cargar la nueva mascota cuando cambie la URL
    });
  }

  private cargarMascota(): void {
    if (this.id) {
      this.mascotaService.getMascotaPorId(this.id).subscribe({
        next: (data) => {
          if (!data || !data._id) {
            console.error("La mascota no tiene un _id válido:", data);
            return;
          }
          this.idMascotaActual = data._id;
          this.mascota.next(data);
          this.mascotaSeleccionada.emit(this.idMascotaActual);
          this.obtenerComentarios();
          this.indiceActual = 0;

          // Obtener la URL de la imagen del avatar del dueño
          const duenoId = data.dueno;
          this.avatarUrl = `${this.peticion.urlHost}/Avatar/${duenoId}.png`;

          this.cdr.detectChanges(); // Forzar actualización en la vista
        },
        error: (error) => console.error('Error al obtener mascota:', error)
      });
    }
  }

  mascota$() {
    return this.mascota.asObservable();
  }

  obtenerComentarios() {
    if (!this.idMascotaActual) {
      console.warn("No se puede obtener los comentarios: idMascotaActual no encontrado");
      return;
    }

    this.commentService.getComments(this.idMascotaActual).subscribe(
      (response) => {
        this.comentarios = response;
      },
      (error) => {
        console.error("Error al obtener los comentarios", error);
      }
    );
  }

  actualizarDetalleMascota(id: string): void {
    console.log("ID recibido del evento verMas:", id);
    this.router.navigate([`/detalle/${id}`]);
  }

  anterior(): void {
    const mascotaData = this.mascota.getValue();
    if (mascotaData && mascotaData.fotos?.length) {
      this.indiceActual = (this.indiceActual - 1 + mascotaData.fotos.length) % mascotaData.fotos.length;
    }
  }

  siguiente(): void {
    const mascotaData = this.mascota.getValue();
    if (mascotaData && mascotaData.fotos?.length) {
      this.indiceActual = (this.indiceActual + 1) % mascotaData.fotos.length;
    }
  }

  getProfileImageUrl(ownerId: string): string {
    return `http://localhost:3000/Avatar/${ownerId}.png`;
  }

  ngOnDestroy(): void {
    if (this.paramMapSubscription) {
      this.paramMapSubscription.unsubscribe();
    }
  }
}
