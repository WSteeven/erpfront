import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ConfiguracionCuestionarioEmpleado extends EntidadAuditable {
  id: number | null
  fecha_hora_inicio: string | null
  fecha_hora_fin: string | null
  constructor() {
    super()
    this.id = null
    this.fecha_hora_inicio = null
    this.fecha_hora_fin = null
  }
}
