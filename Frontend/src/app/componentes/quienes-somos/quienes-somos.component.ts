import { Component } from '@angular/core';
import { EncabezadoComponent } from "../encabezado/encabezado.component";
import { PieDePaginaComponent } from "../pie-de-pagina/pie-de-pagina.component";

@Component({
  selector: 'app-quienes-somos',
  imports: [EncabezadoComponent, PieDePaginaComponent],
  templateUrl: './quienes-somos.component.html',
  styleUrl: './quienes-somos.component.css'
})
export class QuienesSomosComponent {

}
