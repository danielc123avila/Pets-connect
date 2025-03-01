import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeticionService {
  
  constructor(private http:HttpClient) { }
  requestOptions:any = {}
  
  urlHost:string = "http://localhost:3000" 
  post(url:string,payload:any){
    // Un proceso interno de java que se encarga de ejecutar peticones y no termina hasta que np haya
    //respuesta del servidor, tiene dos momentos  resuelto o rechazado
    let promise = new Promise ((resolve, reject) => {

      this.requestOptions = {
        headers: new HttpHeaders ({
        }),
        //Importante, esto permite enviar la cookie 
        withCredentials:true
      }

      this.http.post(url,payload, this.requestOptions).toPromise().then((res:any)=>{
        resolve(res)
      }).catch((error) => {
        console.log(error)
        reject (error)

      })
    })

    return promise

  }


  get(url:string,payload:any){
    // Un proceso interno de java que se encarga de ejecutar peticones y no termina hasta que np haya
    //respuesta del servidor, tiene dos momentos  resuelto o rechazado
    let promise = new Promise ((resolve, reject) => {

      this.requestOptions = {
        headers: new HttpHeaders ({
        //''
        }),
        //Importante, esto permite enviar la cookie 
        withCredentials:true
      }

      this.http.get(url, this.requestOptions).toPromise().then((res:any)=>{
        resolve(res)
      }).catch((error) => {
        console.log(error)
        reject (error)

      })
    })

    return promise

  }



  put(url:string,payload:any){
    // Un proceso interno de java que se encarga de ejecutar peticones y no termina hasta que np haya
    //respuesta del servidor, tiene dos momentos  resuelto o rechazado
    let promise = new Promise ((resolve, reject) => {

      this.requestOptions = {
        headers: new HttpHeaders ({
        //''
        }),
        //Importante, esto permite enviar la cookie 
        withCredentials:true
      }

      this.http.put(url,payload,this.requestOptions).toPromise().then((res:any)=>{
        resolve(res)
      }).catch((error) => {
        console.log(error)
        reject (error)

      })
    })

    return promise

  }

  delete(url:string,payload:any){
    // Un proceso interno de java que se encarga de ejecutar peticones y no termina hasta que np haya
    //respuesta del servidor, tiene dos momentos  resuelto o rechazado
    let promise = new Promise ((resolve, reject) => {
      this.http.delete(url,payload).toPromise().then((res:any)=>{
        resolve(res)
      }).catch((error) => {
        console.log(error)
        reject (error)

      })
    })

    return promise

  }

  Upload(file:File, destino:string):Observable <any>{
    const formData: FormData = new FormData()
    formData.append('userFile', file)
    return this.http.post(this.urlHost + destino, formData)
  }

}
