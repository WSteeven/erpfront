import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class Contacto extends EntidadAuditable {
    identificador: string | null
    nombres: string | null
    apellidos: string | null
    celular: string | null
    provincia: number | null
    ciudad: number | null
    parroquia: string | null
    direccion: string | null
    referencias: string | null
    coordenadas: string | null

    constructor() {
        super()
        this.identificador = null
        this.nombres = null // responsable
        this.apellidos = null
        this.celular = null
        this.provincia = null
        this.ciudad = null
        this.parroquia = null
        this.direccion = null
        this.referencias = null
        this.coordenadas = null
    }
}