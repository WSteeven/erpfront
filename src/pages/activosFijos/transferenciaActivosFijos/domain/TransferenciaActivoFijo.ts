import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useAuthenticationStore } from 'stores/authentication'

export class TransferenciaActivoFijo extends EntidadAuditable {
    solicitante: number | null
    justificacion: string | null
    causa_anulacion: string | null
    autorizador: number | null
    autorizacion: number | null
    observacion_autorizador: string | null
    cliente: number | null | undefined
    empleado_origen: number | null
    empleado_destino: number | null
    listado_productos: any[]

    constructor() {
        super()
        this.solicitante = useAuthenticationStore().user.id
        this.justificacion = null
        this.causa_anulacion = null
        this.autorizador = null
        this.autorizacion = null
        this.observacion_autorizador = null
        this.cliente = null
        this.empleado_origen = null
        this.empleado_destino = null
        this.listado_productos = []
    }
}