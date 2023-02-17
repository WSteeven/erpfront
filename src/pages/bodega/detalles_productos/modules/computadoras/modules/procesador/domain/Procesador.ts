import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Procesador extends EntidadAuditable {
    nombre: string | null

    constructor() {
        super()
        this.nombre = null
    }
}