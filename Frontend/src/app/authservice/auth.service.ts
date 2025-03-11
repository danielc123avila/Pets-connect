import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PeticionService } from '../servicios/peticionservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(true)
  isLoading$ = this.isLoadingSubject.asObservable()

  constructor(private peticion: PeticionService) {
    this.loadSession()
  }

  setAuthenticationStatus(isAuthenticated: boolean) {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  loadSession() {
    let data = {
      host: this.peticion.urlHost,
      path: "/api/status",
      payload: {}
    };

    this.peticion.post(data.host + data.path, data.payload).then((res: any) => {
      console.log("Sesión recibida en loadSession():", res)

      if (res.rol) {
        this.setAuthenticationStatus(true)
      } else {
        this.setAuthenticationStatus(false)
      }
    }).catch(error => {
      this.setAuthenticationStatus(false)
      this.isLoadingSubject.next(false)
    })
  }
}
  
  

