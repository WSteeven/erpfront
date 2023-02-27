import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class FiltroReporteMaterial extends EntidadAuditable {
  tarea: number | null
  grupo: string | null
  fecha: number | null

  constructor() {
    super()
    this.tarea = null
    this.grupo = null
    this.fecha = null
  }
}
