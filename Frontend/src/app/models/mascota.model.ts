export interface Foto {
    url: string;
    thumbnail?: string;
    descripcion?: string;
    _id?: string;
}

export interface Mascota {
    id?: string
    _id?: string
    especie: string
    sexo: string
    nombre:string
    color: string
    raza: string
    ultimaUbicacion:string
    fechaExtravio:string
    descripcion: string
    fotos?: Foto[]
    createdAt?: string
    updatedAt?: string
    palabrasClave?: string[]
    estado:string
    dueno:{
        _id:string;
        nombre: string;
        telefono: string;
        email: string;
        profileImg: string;
        username?: string; 
        direccion?: string;
        edad?: number;
    }
}

export interface Comment {
    _id: string;
    userId: string;
    content: string;
    petId: string;
    createdAt: string;
    avatarUrl?: string; // Se agregará dinámicamente
}