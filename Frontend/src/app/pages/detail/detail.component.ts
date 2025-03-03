import { Mascota } from './../../models/mascota.model';
import { Component, OnInit, signal, Input, inject } from '@angular/core';
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
  mascota = signal<Mascota | null>(null);

  // Input con minúscula inicial para seguir convenciones
  @Input() Mascota: any;

  id: string | null = null;


  // Servicios inyectados
  private mascotaService = inject(MascotaService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('ID desde la URL:', this.id);
    if (this.id) {
      this.mascotaService.getMascotaPorId(this.id).subscribe({
        next: (data) => {
          console.log('Mascota en DetailComponent:', data);
          this.mascota.set(data);
        },
        error: (error) => console.error('Error al obtener mascota:', error)
      });
    }
  }
}
