export interface Mascota {
    id?: string
    especie: string
    sexo: string
    nombre:string
    color: string
    raza: string
    ultimaUbicacion:string
    fechaExtravio:string
    descripcion: string
    fotos?: string[]
    createdAt?: string
    updatedAt?: string
    palabrasClave?: string[]
    estado:string
    dueno:{
        nombre: string;
        telefono: string;
        email: string;
        profileImg: string;
        username?: string; 
        direccion?: string;
        edad?: number;
    }
}
