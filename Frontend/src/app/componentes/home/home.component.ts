import { Component } from '@angular/core';
import { EncabezadoComponent } from "../encabezado/encabezado.component";
import { PieDePaginaComponent } from "../pie-de-pagina/pie-de-pagina.component";
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-home',
  imports: [EncabezadoComponent, PieDePaginaComponent, MatButtonModule, MatDialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private _matDialog: MatDialog) { }
  abrirModal(): void{
  this._matDialog.open(ModalComponent, {
    width: "588px",
    height: "264px"
  });
  }
}
