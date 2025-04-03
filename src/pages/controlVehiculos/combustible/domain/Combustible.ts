import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Combustible extends EntidadAuditable {
    nombre: string | null
    precio: number | null

    constructor() {
        super()
        this.nombre = null
        this.precio = null
    }
}
