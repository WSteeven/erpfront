import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'


export class Devolucion extends EntidadAuditable {
    justificacion: string | null
    solicitante: number | null
    solicitante_id: number | null
    tarea: number | null
    tarea_id: number | null
    canton: number | null
    estado: string | null
    estado_bodega: string | null
    created_at: string | null
    es_para_stock: boolean
    observacion_aut: string | null
    autorizacion: number | null
    per_autoriza: number | null
    per_autoriza_id: number | null
    sucursal: number | null
    sucursal_id: number | null
    cliente: number | null
    cliente_id: number | null
    pedido_automatico: boolean

    listadoProductos: any[]

    //variables auxiliares
    es_tarea: boolean | null
    tiene_observacion_aut: boolean | null

    constructor() {
        super()
        this.justificacion = null
        this.solicitante = null
        this.solicitante_id = null
        this.observacion_aut = null
        this.autorizacion = null
        this.per_autoriza = null
        this.per_autoriza_id = null
        this.tarea = null
        this.tarea_id = null
        this.canton = null
        this.estado = null
        this.estado_bodega = null
        this.created_at = null
        this.es_para_stock = false
        this.listadoProductos = []
        this.sucursal = null
        this.sucursal_id = null
        this.cliente = null
        this.cliente_id = null
        this.pedido_automatico = false

        // variables auxiliares
        this.es_tarea = false
        this.tiene_observacion_aut = false
    }
}