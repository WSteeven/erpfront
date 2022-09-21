import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class SubtipoTransaccion extends EntidadAuditable{
    nombre:string|null
    tipo_transaccion:string|null
    tipo_seleccionado:string|null

    constructor(){
        super()
        this.nombre=null
        this.tipo_transaccion=null
        this.tipo_seleccionado=null
    }
}