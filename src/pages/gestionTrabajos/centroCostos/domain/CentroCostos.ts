import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class CentroCosto extends EntidadAuditable {
    nombre: string | null
    cliente: null | number
    activo: boolean

    constructor() {
        super()
        this.nombre = null
        this.cliente = null
        this.activo = true
    }
}