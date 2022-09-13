import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Modelo extends EntidadAuditable{
    nombre: string |null
    marca: number|null

    constructor(){
        super()
        this.nombre=null
        this.marca=null
    }
}