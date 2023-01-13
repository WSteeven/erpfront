import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Transferencia extends EntidadAuditable{
    justificacion: string|null
    sucursal_salida: number|null
    sucursal_destino: number|null
    cliente: number|null
    solicitante: number|null
    autorizacion: number|null
    per_autoriza: number|null
    recibida: boolean
    estado: number|null
    observacion_est: string|null
    
    //variables auxiliares
    tiene_obs_autorizacion: boolean
    tiene_obs_estado: boolean
    
    // producto: string|null
    listadoProductos:any[]
    
    constructor(){
        super()
        this.id=null
        this.justificacion=null
        this.sucursal_salida=null
        this.sucursal_destino=null
        this.cliente=null
        this.solicitante=null
        this.autorizacion=null
        this.observacion_est=null
        this.estado=null
        this.recibida=false
        this.per_autoriza=null
        
        this.tiene_obs_autorizacion=false
        this.tiene_obs_estado=false
        
        // this.producto=null
        this.listadoProductos=[]
    }
}