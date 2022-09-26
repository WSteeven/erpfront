import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Transaccion extends EntidadAuditable{
    autorizacion: number|null
    observacion_aut: string|null
    justificacion: string|null
    fecha_limite: string|null
    estado: number|null
    observacion_est: string|null
    solicitante: number|null
    //tipo: number|null
    subtipo: number|null
    sucursal: number|null
    per_autoriza: number|null
    per_atiende: number|null
    lugar_destino: string|null
    
    constructor(){
        super()
        this.autorizacion=null
        this.observacion_aut=null
        this.justificacion=null
        this.fecha_limite=null
        this.estado=null
        this.observacion_est=null
        this.solicitante=null
        // this.tipo=null
        this.subtipo=null
        this.sucursal=null
        this.per_autoriza=null
        this.per_atiende=null
        this.lugar_destino=null
    }
}