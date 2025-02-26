import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mascota } from '../../models/mascota.model';
import { MascotaService } from '../../servicios/mascota.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PieDePaginaComponent } from "../../componentes/pie-de-pagina/pie-de-pagina.component";
import { EncabezadoComponent } from "../../componentes/encabezado/encabezado.component";

@Component({
  selector: 'app-detail',
  imports: [FormsModule, CommonModule, PieDePaginaComponent, EncabezadoComponent],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  mascota: Mascota | null = null;
  error: string | null = null;

  constructor(private mascotaService: MascotaService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mascotaService.getMascotaPorId(id).subscribe(
        (data) => {
          this.mascota = data;
          console.log('Mascota recibida:', this.mascota); // Verifica los datos recibidos
        },
        (error) => {
          console.error('Error al obtener la mascota:', error);
        }
      );
    }
  }
}

