import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Prestamo extends EntidadAuditable {
    fecha_salida: string | null
    fecha_devolucion: string | null
    observacion: string | null
    solicitante: string | null
    per_entrega: string | null
    per_recibe: string | null
    estado: string | null

    producto:number|null
    listadoProductos: any[]

    constructor() {
        super()
        this.fecha_salida= null
        this.fecha_devolucion= null
        this.observacion= null
        this.solicitante= null
        this.per_entrega= null
        this.per_recibe= null
        this.estado= null
        this.producto= null
        this.listadoProductos=[]
    }
}