import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EncabezadoComponent } from './componentes/encabezado/encabezado.component';
import { PieDePaginaComponent } from './componentes/pie-de-pagina/pie-de-pagina.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EncabezadoComponent, PieDePaginaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';
}
