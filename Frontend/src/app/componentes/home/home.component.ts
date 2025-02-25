import { Component } from '@angular/core';
import { EncabezadoComponent } from "../encabezado/encabezado.component";
import { PieDePaginaComponent } from "../pie-de-pagina/pie-de-pagina.component";


@Component({
  selector: 'app-home',
  imports: [EncabezadoComponent, PieDePaginaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
