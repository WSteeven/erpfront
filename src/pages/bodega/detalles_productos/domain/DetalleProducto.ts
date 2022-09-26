import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class DetalleProducto extends EntidadAuditable{
    producto:string|null
    descripcion:string|null
    marca:string|null
    modelo:string|null
    serial:string|null
    precio_compra:string|null
    tipo_fibra:string|null
    categoria:string|null
    hilos:string|null
    punta_a:string|null
    punta_b:string|null
    punta_corte:string|null
    //variables auxiliares
    es_fibra:boolean
    tiene_serial:boolean
    tiene_precio_compra:boolean

    constructor(){
        super()
        this.producto=null
        this.descripcion=null
        this.marca=null
        this.modelo=null
        this.serial=null
        this.precio_compra=null
        this.tipo_fibra=null
        this.categoria=null
        this.hilos=null
        this.punta_a=null
        this.punta_b=null
        this.punta_corte=null
        this.es_fibra=false
        this.tiene_serial=false
        this.tiene_precio_compra=false
    }
}