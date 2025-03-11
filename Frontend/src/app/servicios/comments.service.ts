import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private apiUrl = 'http://localhost:3000/api/comments'

  constructor(private http: HttpClient) { }

  getComments(petId: string):Observable<any>{
    return this.http.get(`${this.apiUrl}/listar/${petId}`);
  }

  createComment(commentData: { userId: string; content: string; petId: string }): Observable<any>{
    return this.http.post(`${this.apiUrl}/crear`, commentData)
  }

  updateComment(commentId: string, content: string):Observable<any>{
    return this.http.put(`${this.apiUrl}/${commentId}`, {content});
  }

  deleteComment(commentId: string):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${commentId}`);
  }
}
