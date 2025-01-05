import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class SeguimientoIncidente extends EntidadAuditable {
    causa_raiz: string | null
    acciones_correctivas: string | null
    devolucion: number | null
    pedido: number | null
    solicitud_descuento: number | null
    incidente: number | null

    constructor() {
        super()
        this.causa_raiz = ''
        this.acciones_correctivas = ''
        this.devolucion = null
        this.pedido = null
        this.solicitud_descuento = null
        this.incidente = null
    }
}