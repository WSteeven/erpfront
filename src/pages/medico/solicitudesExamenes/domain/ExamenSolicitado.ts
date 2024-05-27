import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class ExamenSolicitado extends EntidadAuditable {
  id: number | null // estadoSolicitudExamen
  examen: number | null
  examen_id: number | null
  laboratorio_clinico: number | null
  fecha_asistencia: string | null
  hora_asistencia: string | null
  fecha_hora_asistencia: string | null
  categoria: string | null
  detalle_resultado_examen: number | null

  constructor() {
    super()
    this.id = null
    this.examen = null
    this.examen_id = null
    this.laboratorio_clinico = null
    this.fecha_asistencia = null
    this.hora_asistencia = null
    this.fecha_hora_asistencia = null
    this.categoria = null
    this.detalle_resultado_examen = null
  }
}
