import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/status' 

  constructor(private http: HttpClient) {}

  verificarSesion(): Observable<boolean> {
    return this.http.post<{ rol?: string }>('http://localhost:3000/api/status', {}, { withCredentials: true }).pipe(
      map(response => {
        return response?.rol === "1"
      })
    )
  }
}

