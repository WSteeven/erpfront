import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ReporteSubtareasRealizadas extends EntidadAuditable {
  tipo_trabajo: string | null
  suma_trabajo: number | null

  constructor() {
    super()
    this.tipo_trabajo = null
    this.suma_trabajo = null
  }
}
