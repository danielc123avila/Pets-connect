import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  applyFilters(): void {
    // Implementar lógica para aplicar filtros
    console.log('Aplicar filtros');
  }

  clearFilters(): void {
    // Implementar lógica para borrar filtros
    console.log('Borrar filtros');
  }
}
