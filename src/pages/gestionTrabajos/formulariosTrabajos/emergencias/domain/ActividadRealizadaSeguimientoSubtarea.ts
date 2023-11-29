import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export default class ActividadRealizadaSeguimientoSubtarea extends EntidadAuditable {
  fecha_hora: string | null
  trabajo_realizado: string | null
  fotografia: string | null
  subtarea: number | null

  constructor() {
    super()
    this.fecha_hora = null
    this.trabajo_realizado = null
    this.fotografia = null
    this.subtarea = null
  }
}
