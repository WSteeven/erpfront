import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Pedido extends EntidadAuditable {
    justificacion: string | null
    fecha_limite: string | null
    observacion_aut: string | null
    observacion_est: string | null
    solicitante: number | null
    solicitante_id: number | null
    autorizacion: number | null
    per_autoriza: number | null
    tarea: number| null
    sucursal: number | null
    sucursal_id: number | null
    estado: number | null
    created_at: string|null

    listadoProductos: any[]

    //variables auxiliares
    es_tarea:boolean|null
    tiene_observacion_aut:boolean|null
    tiene_observacion_est:boolean|null

    constructor() {
        super()
        this.justificacion= null
        this.fecha_limite= null
        this.observacion_aut= null
        this.observacion_est= null
        this.solicitante= null
        this.solicitante_id= null
        this.autorizacion= null
        this.per_autoriza= null
        this.tarea= null
        this.sucursal= null
        this.sucursal_id= null
        this.estado= null
        this.created_at= null

        this.listadoProductos=[]

        //variables auxiliares
        this.es_tarea=false
        this.tiene_observacion_aut=false
        this.tiene_observacion_est=false
    }
}