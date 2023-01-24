import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";


export class DetalleProductoTransaccion extends EntidadAuditable {
    id: number | null
    inventario_id: number | null
    transaccion_id: number | null
    cantidad_inicial: number | null
    cantidad_final: number | null

    constructor() {
        super()
        this.id= null
        this.inventario_id= null
        this.transaccion_id= null
        this.cantidad_inicial= null
        this.cantidad_final= null
    }

}