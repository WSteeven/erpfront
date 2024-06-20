import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Comprobante extends EntidadAuditable {
    transaccion_id: number | null
    firmada: boolean
    estado: string | null
    observacion: string | null

    constructor() {
        super()
        this.transaccion_id = null
        this.firmada = false
        this.estado = null
        this.observacion = null
    }
}