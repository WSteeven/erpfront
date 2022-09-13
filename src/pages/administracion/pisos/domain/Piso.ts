import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Piso extends EntidadAuditable{
    fila:string|null
    columna:string|null

    constructor(){
        super()
        this.fila=null
        this.columna=null
    }
}