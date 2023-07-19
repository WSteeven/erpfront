import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class OrdenCompra extends EntidadAuditable {
    solicitante: number | null
    proveedor: number | null
    autorizador: number | null
    descripcion: string | null
    forma: string | null
    tiempo: string | null
    fecha: string | null
    created_at: string | null
    categorias: [] | null
    listadoProductos: any[]

    constructor() {
        super()
        this.solicitante = null
        this.proveedor = null
        this.autorizador = null
        this.descripcion = null
        this.forma = null
        this.created_at = null
        this.tiempo = null
        this.fecha = null
        this.categorias = []
        this.listadoProductos = []
    }
}