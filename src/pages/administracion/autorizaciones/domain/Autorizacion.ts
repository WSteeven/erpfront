import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Autorizacion extends EntidadAuditable{
    nombre:string|null

    constructor(){
        super()
        this.nombre=null
    }
}