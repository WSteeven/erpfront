import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class MultaConductor extends EntidadAuditable {
    empleado: string | null
    empleado_id: string | null
    fecha_infraccion: string | null
    placa: string | null
    puntos: string | null
    total: string | null
    estado: string | null
    fecha_pago: string | null
    comentario: string | null

    constructor() {
        super()
        this.empleado = null
        this.empleado_id = null
        this.fecha_infraccion = null
        this.placa = null
        this.puntos = null
        this.total = null
        this.estado = null
        this.fecha_pago = null
        this.comentario = null
    }
}
