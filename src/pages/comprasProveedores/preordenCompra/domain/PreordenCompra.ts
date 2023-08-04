import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class PreordenCompra extends EntidadAuditable {
    solicitante: number | null
    pedido: number | null
    autorizacion: number | null
    justificacion:string | null
    estado:string | null
    autorizador: number | null
    created_at: string | null
    listadoProductos: any[]



    constructor() {
        super()
        this.solicitante = null
        this.pedido = null
        this.justificacion= null
        this.estado= null
        this.autorizador = null
        this.autorizacion = null
        this.created_at = null
        this.listadoProductos = []
    }
}