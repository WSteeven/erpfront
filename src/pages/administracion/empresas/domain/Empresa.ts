import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Empresa extends EntidadAuditable{
    identificacion:string|null
    tipo_contribuyente:string|null
    razon_social:string|null
    nombre_comercial:string|null
    celular:string|null
    telefono:string|null
    correo:string|null
    pais:number|null
    provincia:number|null
    canton:string|null
    ciudad:string|null
    direccion:string|null   
    agente_retencion:boolean
    tipo_negocio:string|null
    sitio_web:string|null

    constructor(){
        super()
        this.identificacion=null
        this.tipo_contribuyente=null
        this.razon_social=null
        this.nombre_comercial=null
        this.celular=null
        this.telefono=null
        this.pais=null
        this.provincia=null
        this.canton=null
        this.ciudad=null
        this.correo=null
        this.direccion=null
        this.agente_retencion=false
        this.tipo_negocio=null
        this.sitio_web=null
    }


}
