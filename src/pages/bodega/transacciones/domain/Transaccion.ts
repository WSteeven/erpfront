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
    subtipo: number|null
    sucursal: number|null
    autoriza: number|null
    atiende: number|null
    per_retira: number|null
    tarea: string|null
    subtarea: string|null
    created_at: string|null
    //variables auxiliares
    tiene_obs_autorizacion: boolean
    tiene_obs_estado: boolean
    retira_tercero:boolean

    producto: string|null
    listadoProductosSeleccionados:any[]
    
    constructor(){
        super()
        this.id=null
        this.autorizacion=null
        this.obs_autorizacion=null
        this.justificacion=null
        this.comprobante=null
        this.fecha_limite=null
        this.estado=null
        this.obs_estado=null
        this.solicitante=null
        this.solicitante_id=null
        this.tipo=null
        this.subtipo=null
        this.sucursal=null
        this.autoriza=null
        this.atiende=null
        this.per_retira=null
        this.tarea=null
        this.subtarea=null
        this.created_at=null

        this.tiene_obs_autorizacion=false
        this.tiene_obs_estado=false
        this.retira_tercero=false

        this.producto=null
        this.listadoProductosSeleccionados=[]
    }
}