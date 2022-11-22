import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Movimiento extends EntidadAuditable{
    inventario:number|null
    transaccion:number|null
    cantidad:number|null
    precio_unitario:number|null
    saldo:number|null

    constructor(){
        super()
        this.inventario=null
        this.transaccion=null
        this.cantidad=null
        this.precio_unitario=null
        this.saldo=null
    }
}