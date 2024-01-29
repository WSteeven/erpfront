import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class EstadoSolicitudExamen extends EntidadAuditable {
  observacion: string | null
  fecha_asistencia: string | null
  hora_asistencia: string | null

  constructor() {
    super()
    this.observacion = null
    this.fecha_asistencia = null
    this.hora_asistencia = null
  }
}
