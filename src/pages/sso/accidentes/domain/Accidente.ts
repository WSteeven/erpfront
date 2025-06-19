import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Accidente extends EntidadAuditable {
    titulo: string | null
    descripcion: string | null
    medidas_preventivas: string | null
    empleados_involucrados: string | null
    fecha_hora_ocurrencia: string | null
    coordenadas: string | null
    consecuencias: string | null
    lugar_accidente: string | null
    estado: string | null
    empleado_reporta: string | null
    seguimiento_accidente: number | null

    constructor() {
        super()
        this.titulo = null
        this.descripcion = null
        this.medidas_preventivas = null
        this.empleados_involucrados = null
        this.fecha_hora_ocurrencia = null
        this.coordenadas = null
        this.consecuencias = null
        this.lugar_accidente = null
        this.estado = null
        this.empleado_reporta = null
        this.seguimiento_accidente = null
    }
}