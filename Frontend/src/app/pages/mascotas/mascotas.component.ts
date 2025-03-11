import { MascotaService } from './../../servicios/mascota.service';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Mascota } from './../../models/mascota.model';
import { SidebarComponent } from './../../componentes/sidebar/sidebar.component';
import { CardComponent } from './../../componentes/card/card.component';
import { NgFor } from '@angular/common';
import { EncabezadoComponent } from "../../componentes/encabezado/encabezado.component";
import { PieDePaginaComponent } from "../../componentes/pie-de-pagina/pie-de-pagina.component";

@Component({
  selector: 'app-mascotas',
  standalone: true, // Asegúrate de que esto esté configurado si usas standalone components
  imports: [SidebarComponent, CardComponent, NgFor, EncabezadoComponent, PieDePaginaComponent],
  templateUrl: './mascotas.component.html',
  styleUrls: ['./mascotas.component.css'], // Corrige la propiedad para 'styleUrls'
})
export class MascotasComponent implements OnInit {
  mascotaService = inject(MascotaService);
  mascotas = signal<Mascota[]>([]); // Usa signal para inicializar un array vacío

  ngOnInit(): void {
    this.mascotaService.getMascotas().subscribe({
      next: (data) => this.mascotas.set(data),
      error: (error) => console.error('Error al obtener mascotas:', error),
    });
  }
  getmascotas() {
    this.mascotaService.getMascotas().subscribe((res: any) => {
      console.log(res);
      const mascotas = [];
      for (let i = 0; i < res.length; i++) {
        mascotas.push(res[i]);
      }
      console.log(mascotas);
      this.mascotas.set(mascotas);
    });
  }

  totalPets: number = 20;
  location: string = 'Córdoba';
  lastDays: number = 30;
  currentPage = 0;
  pages = new Array(10);

  changePage(page: number): void {
    this.currentPage = page;
  }

  nextPage(): void {
    if (this.currentPage < this.pages.length - 1) {
      this.currentPage++;
    }
  }

  publishPet(): void {
    // Implementar lógica para publicar una mascota
    console.log('Publicar mascota');
  }

  sortPets(): void {
    // Implementar lógica para ordenar mascotas
    console.log('Ordenar mascotas');
  }
}
