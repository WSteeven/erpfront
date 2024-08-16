import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class SeguimientoConsumoActivoFijo extends EntidadAuditable {
    fecha_hora: string | null
    cantidad_utilizada: number | null
    cantidad_anterior: number | null
    detalle_producto: string | null
    serie: string | null
    canton: string | null
    categoria_motivo_consumo: string | null
    motivo_consumo: string | null
    observacion: string | null
    cliente: number | null | undefined
    empleado: number | null
    se_reporto_sicosep: boolean

    constructor() {
        super()
        this.fecha_hora = null
        this.cantidad_utilizada = null
        this.cantidad_anterior = null
        this.detalle_producto = null
        this.serie = null
        this.canton = null
        this.categoria_motivo_consumo = null
        this.motivo_consumo = null
        this.observacion = null
        this.cliente = null
        this.empleado = null
        this.se_reporto_sicosep = false
    }
}