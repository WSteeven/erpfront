import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'


export class Devolucion extends EntidadAuditable {
    justificacion: string | null
    solicitante: number | null
    tarea: number | null
    tarea_id: number | null
    canton: number | null
    estado: string | null
    created_at: string | null
    stock_personal: boolean

    listadoProductos: any[]

    //variables auxiliares
    es_tarea: boolean | null

    constructor() {
        super()
        this.justificacion = null
        this.solicitante = null
        this.tarea = null
        this.tarea_id = null
        this.canton = null
        this.estado = null
        this.created_at = null
        this.stock_personal =false
        this.listadoProductos = []

        // variables auxiliares
        this.es_tarea = false
    }
}