import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class ActivoFijo extends EntidadAuditable {
    cantidad: number | null
    fecha_desde: string | null
    fecha_hasta: string | null
    accion: string | null
    observacion: string | null
    lugar: string | null
    producto: number | null
    detalle_id: number | null
    empleado: number | null
    sucursal: number | null
    condicion: number | null

    constructor() {
        super()
        this.cantidad = null
        this.fecha_desde = null
        this.fecha_hasta = null
        this.accion = null
        this.observacion = null
        this.lugar = null
        this.producto = null
        this.detalle_id = null
        this.empleado = null
        this.sucursal = null
        this.condicion = null
    }
}