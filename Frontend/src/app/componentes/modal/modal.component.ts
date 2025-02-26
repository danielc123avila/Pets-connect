import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ModalGenailComponent } from '../modal-genial/modal-genial.component';
@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  constructor(
    public matDialogRef: MatDialogRef<ModalComponent>,
    private _matDialog: MatDialog
  ) {}
  closeModal() {
    this.matDialogRef.close();
  }
  abrirModal(): void {
    this.matDialogRef.close();
    this._matDialog.open(ModalGenailComponent, {
      width: '588px',
      height: '354px',
    });
  }
}
