import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Tramo extends EntidadAuditable {
    nombre: string | null

    constructor() {
        super()
        this.nombre = null
    }
}