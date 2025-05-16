import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class DetalleVacacion extends EntidadAuditable {
  vacacion_id: string | null
  fecha_inicio: string | null
  fecha_fin: string | null
  dias_utilizados: string | null
  vacacionable_id: string | null
  vacacionable_type: string | null
  observacion: string | null
  anulado: string | null
  motivo_anulacion: string | null

  constructor() {
    super()
    this.vacacion_id = null
    this.fecha_inicio = null
    this.fecha_fin = null
    this.dias_utilizados = null
    this.vacacionable_id = null
    this.vacacionable_type = null
    this.observacion = null
    this.anulado = null
    this.motivo_anulacion = null
  }
}
