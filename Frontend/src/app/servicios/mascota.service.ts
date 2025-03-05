import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  map, tap } from 'rxjs/operators';
import { Mascota } from '../models/mascota.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MascotaService {
  constructor(private http: HttpClient) {}

  urlBase: string = "http://localhost:3000/api";

  getMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.urlBase}/mascotas`).pipe(
      tap((response) => console.log('Respuesta de API:')), // Verifica la respuesta real
      map((response) => {
        if (!Array.isArray(response)) {
          console.error('Respuesta inesperada de API:');
          return [];
        }
        return response; // Directamente retornar el array
      })
    );
  }

  getMascotaPorId(id: string): Observable<Mascota> {
    return this.http.get<{ success: boolean; data: Mascota }>(`${this.urlBase}/mascotas/${id}`).pipe(
      tap((response: { success: boolean; data: Mascota }) => console.log('Respuesta de API:', response)), //  Verifica respuesta
      map((response) => {
        if (!response.success || !response.data) {
          throw new Error('La API no devolvió datos válidos');
        }
        return response.data;
      })
    );
  }

  crearMascota(mascota: Mascota, imagen?: File): Observable<Mascota> {
    const formData = new FormData();
    Object.keys(mascota).forEach(key => {
      const value = (mascota as any)[key];
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
    });

    if (imagen) {
      formData.append('imagen', imagen);
    }

    return this.http.post<{ success: boolean; data: Mascota }>(this.urlBase, formData).pipe(
      tap((response) => console.log('Respuesta de API (crear):', response)),
      map((response) => response.data)
    );
  }

  actualizarMascota(id: string, mascota: Partial<Mascota>): Observable<Mascota> {
    return this.http.put<{ success: boolean; data: Mascota }>(`${this.urlBase}/mascotas/${id}`, mascota).pipe(
      tap((response) => console.log('Respuesta de API (actualizar):', response)),
      map((response) => response.data)
    );
  }

  eliminarMascota(id: string): Observable<boolean> {
    return this.http.delete<{ success: boolean }>(`${this.urlBase}/mascotas/${id}`).pipe(
      tap((response) => console.log('Respuesta de API (eliminar):', response)),
      map((response) => response.success ?? false) // Previene undefined
    );
  }
}