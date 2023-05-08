import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Pedido extends EntidadAuditable {
    justificacion: string | null
    fecha_limite: string | null
    observacion_aut: string | null
    observacion_est: string | null
    solicitante: number | null
    solicitante_id: number | null
    responsable: number | null
    responsable_id: number | null
    autorizacion: number | null
    per_autoriza: number | null
    per_autoriza_id: number | null
    per_retira: number | null
    per_retira_id: number | null
    evidencia1:string | null
    evidencia2:string | null
    tarea: number | null
    tarea_id: number | null
    cliente: number | null
    cliente_id: number | null
    sucursal: number | null
    sucursal_id: number | null
    estado: number | null
    created_at: string | null

    listadoProductos: any[]

    //variables auxiliares
    es_tarea: boolean |null
    tiene_fecha_limite: boolean | null
    tiene_observacion_aut: boolean | null
    tiene_observacion_est: boolean | null
    retira_tercero: boolean
    tiene_evidencia: boolean
    para_cliente: boolean

    constructor() {
        super()
        this.justificacion = null
        this.fecha_limite = null
        this.observacion_aut = null
        this.observacion_est = null
        this.solicitante = null
        this.solicitante_id = null
        this.responsable = null
        this.responsable_id = null
        this.autorizacion = null
        this.per_autoriza = null
        this.per_autoriza_id = null
        this.per_retira= null
        this.per_retira_id= null
        this.evidencia1= null
        this.evidencia2= null
        this.tarea = null
        this.tarea_id = null
        this.cliente = null
        this.cliente_id = null
        this.sucursal = null
        this.sucursal_id = null
        this.estado = null
        this.created_at = null

        this.listadoProductos = []

        //variables auxiliares
        this.es_tarea = false
        this.tiene_fecha_limite = false
        this.tiene_observacion_aut = false
        this.tiene_observacion_est = false
        this.retira_tercero = false
        this.tiene_evidencia = false
        this.para_cliente = false
    }
}
