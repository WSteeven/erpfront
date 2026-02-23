import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export default class Coordenada extends EntidadAuditable{
    subtarea: number | null
    tipo: number | null
    coordenada: string | null
    nombre: string | null
        latitud: number | null
        longitud: number | null
        direccion: string | null // nullable
        observacion: string | null //nullable

    constructor(){
        super()
        this.subtarea = null
        this.coordenada = null
        this.tipo = null
        this.nombre = null
        this.latitud = null
        this.longitud = null
        this.direccion = null
        this.observacion = null
    }
}
