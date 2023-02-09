import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Disco extends EntidadAuditable {
    nombre: string | null

    constructor() {
        super()
        this.nombre = null
    }
}