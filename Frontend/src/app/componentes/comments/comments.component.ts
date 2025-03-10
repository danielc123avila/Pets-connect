import { ChangeDetectorRef, Component, EventEmitter, Input, input, OnChanges, OnInit, Output, output, SimpleChanges } from '@angular/core';
import { CommentsService } from '../../servicios/comments.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments',
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit, OnChanges {
  @Input() petId!: string;
  @Output() commentAdded = new EventEmitter<void>();

  comments: any[] = [];
  commentContent: string = '';

  constructor(private commentService: CommentsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!this.petId) {
      console.warn("No se puede obtener comentarios: petId no encontrado", this.petId);
      return;
    }
    this.obtenerComentarios();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['petId'] && !changes['petId'].firstChange) {
      // Si petId cambia, obtenemos los comentarios para la nueva mascota
      this.obtenerComentarios();
    }
  }

  obtenerComentarios() {
    if (!this.petId) {
      console.warn("No se puede obtener los comentarios: petId no encontrado");
      return;
    }

    this.commentService.getComments(this.petId).subscribe(
      (response) => {
        if (response && Array.isArray(response.comments)) {
          this.comments = response.comments;
        } else {
          this.comments = [];
        }
        // Forzar la detección de cambios para actualizar la vista
        this.cdr.detectChanges();
      },
      (error) => {
        console.error("Error al obtener comentarios", error);
      }
    );
  }

  postComment() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Error: No se encontró el usuario. Inicia sesión nuevamente");
      return;
    }

    if (!this.commentContent.trim()) {
      alert('El comentario no puede estar vacío');
      return;
    }

    const commentData = {
      userId: userId,
      content: this.commentContent,
      petId: this.petId,
    };

    this.commentService.createComment(commentData).subscribe(
      (response) => {
        this.commentContent = '';
        this.commentAdded.emit(); 
        this.obtenerComentarios(); // Recargar comentarios después de agregar uno nuevo
      },
      (error) => {
        console.error("Error al crear el comentario", error);
      }
    );
  }
}
