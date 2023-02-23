import Observacion from 'tareas/controlTareas/modules/subtareas/domain/Observacion'
import TrabajoRealizado from 'tareas/controlTareas/modules/subtareas/domain/TrabajoRealizado'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Emergencia extends EntidadAuditable {
    regional: string | null
    atencion: string | null
    tipo_intervencion: string | null
    causa_intervencion: string | null
    fecha_reporte_problema: string | null
    hora_reporte_problema: string | null
    fecha_arribo: string | null
    hora_arribo: string | null
    fecha_fin_reparacion: string | null
    hora_fin_reparacion: string | null
    fecha_retiro_personal: string | null
    hora_retiro_personal: string | null
    trabajos_realizados: TrabajoRealizado[]
    observaciones: Observacion[]
    imagen_lectura_antes: string | null

    constructor() {
        super()
        this.regional = null
        this.atencion = null
        this.tipo_intervencion = null
        this.causa_intervencion = null
        this.fecha_reporte_problema = null
        this.hora_reporte_problema = null
        this.fecha_arribo = null
        this.hora_arribo = null
        this.fecha_fin_reparacion = null
        this.hora_fin_reparacion = null
        this.fecha_retiro_personal = null
        this.hora_retiro_personal = null
        this.trabajos_realizados = []
        this.observaciones = []
        this.imagen_lectura_antes = null
    }
}