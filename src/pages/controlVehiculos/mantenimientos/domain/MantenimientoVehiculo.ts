import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class MantenimientoVehiculo extends EntidadAuditable {
    vehiculo: string | null
    servicio: string | null
    empleado: string | null
    supervisor: string | null
    fecha_realizado: string | null
    km_realizado: string | null
    imagen_evidencia: string | null
    estado: string | null
    km_retraso: string | null
    dias_postergado: string | null
    motivo_postergacion: string | null
    observacion: string | null

    constructor() {
        super()
        this.vehiculo = null
        this.servicio = null
        this.empleado = null
        this.supervisor = null
        this.fecha_realizado = null
        this.km_realizado = null
        this.imagen_evidencia = null
        this.estado = null
        this.km_retraso = null
        this.dias_postergado = null
        this.motivo_postergacion = null
        this.observacion = null
    }
}