import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class PreordenCompra extends EntidadAuditable {
    solicitante: number | null
    solicitante_id: number | null
    pedido: number | null
    autorizacion: number | null
    autorizacion_id: number | null
    justificacion: string | null
    estado: string | null
    autorizador: number | null
    autorizador_id: number | null
    created_at: string | null
    listadoProductos: any[]



    constructor() {
        super()
        this.solicitante = null
        this.solicitante_id = null
        this.pedido = null
        this.justificacion = null
        this.estado = null
        this.autorizador = null
        this.autorizador_id = null
        this.autorizacion = null
        this.autorizacion_id = null
        this.created_at = null
        this.listadoProductos = []
    }
}