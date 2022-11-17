import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Transaccion extends EntidadAuditable{
    id: number|null
    autorizacion: number|null
    observacion_aut: string|null
    justificacion: string|null
    comprobante: string|null
    fecha_limite: string|null
    estado: number|null
    observacion_est: string|null
    solicitante: number|null
    solicitante_id: number|null
    tipo: number|null
    subtipo: number|null
    sucursal: number|null
    autoriza: number|null
    atiende: number|null
    tarea: string|null
    subtarea: string|null
    created_at: string|null
    //variables auxiliares
    tiene_obs_autorizacion: boolean
    tiene_obs_estado: boolean

    producto: string|null
    listadoProductosSeleccionados:any[]
    
    constructor(){
        super()
        this.id=null
        this.autorizacion=null
        this.observacion_aut=null
        this.justificacion=null
        this.comprobante=null
        this.fecha_limite=null
        this.estado=null
        this.observacion_est=null
        this.solicitante=null
        this.solicitante_id=null
        this.tipo=null
        this.subtipo=null
        this.sucursal=null
        this.autoriza=null
        this.atiende=null
        this.tarea=null
        this.subtarea=null
        this.created_at=null

        this.tiene_obs_autorizacion=false
        this.tiene_obs_estado=false

        this.producto=null
        this.listadoProductosSeleccionados=[]
    }
}