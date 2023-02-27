import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Empresa extends EntidadAuditable{
    identificacion:string|null
    tipo_contribuyente:string|null
    razon_social:string|null
    nombre_comercial:string|null
    telefono:string|null
    correo:string|null
    direccion:string|null

    constructor(){
        super()
        this.identificacion=null
        this.tipo_contribuyente=null
        this.razon_social=null
        this.nombre_comercial=null
        this.telefono=null
        this.correo=null
        this.direccion=null
    }


}
