import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-genail',
  imports: [],
  templateUrl: './modal-genial.component.html',
  styleUrl: './modal-genial.component.css'
})
export class ModalGenailComponent {
  constructor(
    public matDialogRef: MatDialogRef<ModalGenailComponent>,
  ) {}
  closeModal() {
    this.matDialogRef.close();
  }

}
