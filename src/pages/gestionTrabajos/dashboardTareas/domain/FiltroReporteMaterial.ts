import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class FiltroDashboardTicket extends EntidadAuditable {
  fecha_inicio: string | null
  fecha_fin: string | null
  empleado: number | null

  constructor() {
    super()
    this.fecha_inicio = null
    this.fecha_fin = null
    this.empleado = null
  }
}
