import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Proforma extends EntidadAuditable {
    autorizacion_id: number | null
    autorizacion: number | null
    autorizador_id: number | null
    autorizador: number | null
    causa_anulacion: number | null
    cliente_id: number | null
    cliente: number | null
    codigo: number | null
    created_at: string | null
    descripcion: string | null
    descuento_general: number 
    estado: number | null
    forma: string | null
    iva: number
    listadoProductos: any[]
    observacion_aut: string | null
    solicitante_id: number | null
    solicitante: number | null
    tiempo: string | null

    //variables auxiliares
    copia_proforma: boolean
    id_aux: number|null
    modificar_descuento: boolean
    modificar_iva: boolean
    tiene_pedido: boolean
    tiene_preorden: boolean

    constructor() {
        super()
        this.autorizacion = null
        this.autorizacion_id= null
        this.autorizador = null
        this.autorizador_id = null
        this.causa_anulacion = null
        this.cliente = null
        this.cliente_id= null
        this.codigo = null
        this.copia_proforma = false
        this.created_at = null
        this.descripcion = null
        this.descuento_general = 0
        this.estado = null
        this.forma = null
        this.id_aux = null
        this.iva = 12
        this.listadoProductos = []
        this.modificar_descuento = false
        this.modificar_iva = false
        this.observacion_aut = null
        this.solicitante = null
        this.solicitante_id = null
        this.tiempo = null
        this.tiene_pedido = false
        this.tiene_preorden = false
    }
}
