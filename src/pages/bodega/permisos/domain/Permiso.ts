import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Permiso extends EntidadAuditable {
    nombre: string | null
    fecha_caducidad: string | null
    fecha_emision: string | null
    imagen_permiso: string | null

    constructor() {
        super()
        this.nombre = null
        this.fecha_caducidad = null
        this.fecha_emision = null
        this.imagen_permiso = null
    }
}
