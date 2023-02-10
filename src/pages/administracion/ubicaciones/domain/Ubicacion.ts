import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Ubicacion extends EntidadAuditable {
    codigo: string | null
    sucursal: number | null
    percha: string | number | null
    piso: string | number | null

    constructor() {
        super()
        this.codigo = null
        this.sucursal = null
        this.percha = null
        this.piso = null
    }
}