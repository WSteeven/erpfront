import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class MultaConductor extends EntidadAuditable {
    empleado: number | null
    empleado_id: string | null
    fecha_infraccion: string | null
    placa: string | null
    puntos: string | number | null
    total: string | null
    estado: boolean
    descontable: boolean
    fecha_pago: string | null
    comentario: string | null

    constructor() {
        super()
        this.empleado = null
        this.empleado_id = null
        this.fecha_infraccion = null
        this.placa = null
        this.puntos = 0
        this.total = null
        this.estado = false
        this.descontable = true
        this.fecha_pago = null
        this.comentario = null
    }
}
