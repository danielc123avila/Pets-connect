import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class InterceptorService implements HttpInterceptor {

  constructor() { }
  // tiene configuraciones que necesitemos
  requestOptions:any = {}

  //Creacion de interceptor
  // Retorna un elemento de tipo observable
  intercept(req: HttpRequest<any>, next:HttpHandler): Observable<HttpEvent<any>> {
    this.requestOptions = {
      headers: new HttpHeaders ({
      //''
      }),
      //Importante, esto permite enviar la cookie 
      withcredentials:true
    }
    console.log('Interceptor')
    const reqClone = req.clone(this.requestOptions)
    return next.handle(reqClone)
  } //Fin de creacion interceptor, se debe añadir al app.config
}
