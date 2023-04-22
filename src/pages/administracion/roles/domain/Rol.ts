import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Rol extends EntidadAuditable {
    nombre: string | null
    name: string | null

    constructor() {
        super()
        this.nombre = null
        this.name = null
    }
}
