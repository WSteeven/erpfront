import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Permiso extends EntidadAuditable {
    nombre: string | null
    caducidad: string | null
    emision: string | null

    constructor() {
        super()
        this.nombre = null
        this.caducidad = null
        this.emision = null
    }
}
