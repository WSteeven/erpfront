import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Ubicacion extends EntidadAuditable{
    codigo:string|null
    percha:string|number|null
    piso:string|number|null

    constructor(){
        super()
        this.codigo=null
        this.percha=null
        this.piso=null
    }
}