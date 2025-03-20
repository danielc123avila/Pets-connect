import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Mascota } from '../models/mascota.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MascotaService {
  private mascotaSubject = new BehaviorSubject<Mascota | null>(null);  // Comienza con null, lo cambiarás cuando lleguen los datos
  mascota$ = this.mascotaSubject.asObservable();  // Exponemos el observable

  constructor(private http: HttpClient) {}

  urlBase: string = 'http://localhost:3000/api';

  // Obtener todas las mascotas
  getMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.urlBase}/mascotas`).pipe(
      // tap((response) => console.log('Respuesta de API:', response)),
      map((response) => {
        if (!Array.isArray(response)) {
          console.error('Respuesta inesperada de API');
          return [];
        }
        return response;
      })
    );
  }

  // Obtener mascota por ID
  getMascotaPorId(id: string): Observable<Mascota> {
    return this.http.get<{ success: boolean; data: Mascota }>(`${this.urlBase}/mascotas/${id}`).pipe(
      tap((response) => console.log('Respuesta de API:', response)),
      map((response) => {
        if (!response.success || !response.data) {
          throw new Error('La API no devolvió datos válidos');
        }
        this.mascotaSubject.next(response.data);  // Emite la nueva mascota
        return response.data;
      })
    );
  }

  // Crear una nueva mascota
  crearMascota(formData: FormData) {
    return this.http
      .post<{ success: boolean; data: Mascota }>(`${this.urlBase}/mascotas`, formData)
      .pipe(
        tap((response) => console.log('Respuesta de API (crear):', response)),
        map((response) => response.data)
      );
  }

  // Actualizar la mascota
  actualizarMascota(id: string, mascota: Partial<Mascota>): Observable<Mascota> {
    return this.http
      .put<{ success: boolean; data: Mascota }>(`${this.urlBase}/mascotas/${id}`, mascota)
      .pipe(
        tap((response) => console.log('Respuesta de API (actualizar):', response)),
        map((response) => response.data)
      );
  }

  // Eliminar una mascota
  eliminarMascota(id: string): Observable<boolean> {
    return this.http
      .delete<{ success: boolean }>(`${this.urlBase}/mascotas/${id}`)
      .pipe(
        tap((response) => console.log('Respuesta de API (eliminar):', response)),
        map((response) => response.success ?? false)
      );
  }
}
