import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export default class NovedadVenta extends EntidadAuditable {
    fecha_hora: string | null
    actividad: string | null
    observacion: string | null
    fotografia: string | null
    venta: number | null

    constructor() {
        super()
        this.fecha_hora = null
        this.actividad = null
        this.observacion = null
        this.fotografia = null
        this.venta = null
    }
}