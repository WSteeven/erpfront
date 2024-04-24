import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Prefactura extends EntidadAuditable {
    codigo: number | null
    solicitante: number | null
    cliente: number | null
    proforma: number | null
    descripcion: string | null
    forma: string | null
    tiempo: string | null
    estado: number | null
    created_at: string | null
    iva: number
    listadoProductos: any[]
    descuento_general: number

    //variables auxiliares
    tiene_proforma: boolean
    tiene_pedido: boolean
    modificar_iva: boolean
    modificar_descuento: boolean

    constructor() {
        super()
        this.codigo = null
        this.solicitante = null
        this.cliente = null
        this.proforma = null
        this.descripcion = null
        this.forma = null
        this.created_at = null
        this.tiempo = null
        this.estado = null
        this.iva = 15
        this.listadoProductos = []
        this.tiene_proforma = false
        this.tiene_pedido = false
        this.modificar_iva = false
        this.descuento_general = 0
        this.modificar_descuento = false
    }
}
