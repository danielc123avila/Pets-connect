import { Component, inject, Input } from '@angular/core';
import { Mascota } from './../../models/mascota.model';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

@Input() mascota: Mascota | null = null;

  viewDetails(): void {
    // Implementar lógica para ver detalles de la mascota
    console.log('Ver detalles de');
  }
}
