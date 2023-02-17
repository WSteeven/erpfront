import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class CodigoCliente extends EntidadAuditable {
    codigo: string | null
    cliente: string | null
    producto: string | null

    constructor() {
        super()
        this.codigo = null
        this.cliente = null
        this.producto = null
    }
}