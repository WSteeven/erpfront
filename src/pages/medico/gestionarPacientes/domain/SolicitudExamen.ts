import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class SolicitudExamen extends EntidadAuditable {
  registro_empleado_examen_id: number | null
  created_at: string | null
  cantidad_examenes_solicitados: number | null
  examenes_ids: []

  constructor() {
    super()
    this.registro_empleado_examen_id = null
    this.created_at = null
    this.cantidad_examenes_solicitados = null
    this.examenes_ids = []
  }
}
