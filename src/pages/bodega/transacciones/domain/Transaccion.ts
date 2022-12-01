import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Transaccion extends EntidadAuditable{
    id: number|null
    autorizacion: number|null
    obs_autorizacion: string|null
    justificacion: string|null
    comprobante: string|null
    fecha_limite: string|null
    estado: number|null
    obs_estado: string|null
    solicitante: number|null
    solicitante_id: number|null
    tipo: number|null
    motivo: number|null
    sucursal: number|null
    per_autoriza: number|null
    per_atiende: number|null
    per_retira: number|null
    tarea: string|null
    cliente: string|null
    created_at: string|null
    
    //variables auxiliares
    tiene_obs_autorizacion: boolean
    tiene_obs_estado: boolean
    retira_tercero:boolean
    ingreso_masivo:boolean
    es_tarea:boolean

    // producto: string|null
    listadoProductosTransaccion:any[]
    
    constructor(){
        super()
        this.id=null
        this.justificacion=null
        this.comprobante=null
        this.fecha_limite=null
        this.solicitante_id=null
        this.solicitante=null
        this.motivo=null
        this.tarea=null
        this.tipo=null
        this.autorizacion=null
        this.obs_autorizacion=null
        this.estado=null
        this.obs_estado=null
        this.sucursal=null
        this.cliente=null
        this.per_autoriza=null
        this.per_atiende=null
        this.per_retira=null
        this.created_at=null

        this.tiene_obs_autorizacion=false
        this.tiene_obs_estado=false
        this.retira_tercero=false
        this.ingreso_masivo=false
        this.es_tarea=false

        // this.producto=null
        this.listadoProductosTransaccion=[]
    }
}