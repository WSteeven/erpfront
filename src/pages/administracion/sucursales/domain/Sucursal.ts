import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Sucursal extends EntidadAuditable{
    lugar: string|null
    telefono: string|null
    correo: string|null

    constructor(){
        super()
        this.lugar=null
        this.telefono=null
        this.correo=null
    }
}