import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class DetalleProducto extends EntidadAuditable{
    categoria:string|null
    producto:string|null
    descripcion:string|null
    marca:string|null
    modelo:string|null
    serial:string|null
    precio_compra:string|null
    
    ram:string|null
    disco:string|null
    procesador:string|null

    computadora:string|null
    fibra: string|null

    span:string|null
    tipo_fibra:string|null
    hilos:string|null
    punta_inicial:string|null
    punta_final:string|null
    custodia:string|null
    puntas:string|null
    adicionales: string|null

    //variables auxiliares
    tiene_serial:boolean
    es_computadora:boolean
    es_fibra:boolean
    tiene_precio_compra:boolean
    tiene_adicionales:boolean

    constructor(){
        super()
        this.producto=null
        this.descripcion=null
        this.marca=null
        this.modelo=null
        this.serial=null
        this.precio_compra=null
        this.ram=null
        this.disco=null
        this.procesador=null
        this.computadora=null
        this.fibra=null
        this.span=null
        this.tipo_fibra=null
        this.categoria=null
        this.hilos=null
        this.punta_inicial=null
        this.punta_final=null
        this.custodia=null
        this.puntas=null
        this.adicionales=null
        this.es_computadora=false
        this.es_fibra=false
        this.tiene_serial=false
        this.tiene_precio_compra=false
        this.tiene_adicionales=false
    }
}