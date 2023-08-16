import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class OfertaProveedor extends EntidadAuditable{
    nombre: string|null
    constructor(){
        super()
        this.nombre = null;
    }
}