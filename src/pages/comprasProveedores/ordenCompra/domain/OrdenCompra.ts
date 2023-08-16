import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class OrdenCompra extends EntidadAuditable {
    codigo: number | null
    solicitante: number | null
    proveedor: number | null
    autorizador: number | null
    autorizacion: number | null
    descripcion: string | null
    preorden: number | null
    pedido: number | null
    forma: string | null
    tiempo: string | null
    estado: number | null
    fecha: string | null
    created_at: string | null
    iva: number
    categorias: [] | null
    listadoProductos: any[]

    //variables auxiliares
    tiene_preorden: boolean
    tiene_pedido: boolean
    modificar_iva: boolean

    constructor() {
        super()
        this.codigo = null
        this.solicitante = null
        this.proveedor = null
        this.autorizador = null
        this.autorizacion = null
        this.descripcion = null
        this.preorden = null
        this.pedido = null
        this.forma = null
        this.created_at = null
        this.tiempo = null
        this.estado = null
        this.fecha = null
        this.iva = 12
        this.categorias = []
        this.listadoProductos = []
        this.tiene_preorden = false
        this.tiene_pedido = false
        this.modificar_iva = false
    }
}