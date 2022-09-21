import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class TipoTransaccion extends EntidadAuditable{
    nombre:string |null
    tipo: string | null

    constructor(){
        super()
        this.nombre=null
        this.tipo=null
    }
}