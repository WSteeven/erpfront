import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Percha extends EntidadAuditable{
    nombre:string|null
    sucursal:number|null

    constructor(){
        super()
        this.nombre=null
        this.sucursal=null
    }
}