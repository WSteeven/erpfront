import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Proforma extends EntidadAuditable {
    codigo: number | null
    solicitante: number | null
    solicitante_id: number | null
    cliente: number | null
    cliente_id: number | null
    autorizador: number | null
    autorizador_id: number | null
    autorizacion: number | null
    autorizacion_id: number | null
    descripcion: string | null
    forma: string | null
    tiempo: string | null
    estado: number | null
    causa_anulacion: number | null
    created_at: string | null
    iva: number
    listadoProductos: any[]

    //variables auxiliares
    tiene_preorden: boolean
    tiene_pedido: boolean
    modificar_iva: boolean

    constructor() {
        super()
        this.codigo = null
        this.solicitante = null
        this.solicitante_id = null
        this.cliente = null
        this.cliente_id= null
        this.autorizador = null
        this.autorizador_id = null
        this.autorizacion = null
        this.autorizacion_id= null
        this.descripcion = null
        this.forma = null
        this.created_at = null
        this.tiempo = null
        this.estado = null
        this.causa_anulacion = null
        this.iva = 12
        this.listadoProductos = []
        this.tiene_preorden = false
        this.tiene_pedido = false
        this.modificar_iva = false
    }
}
