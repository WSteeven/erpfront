import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ReporteCuestionarioEmpleado extends EntidadAuditable {
  id: number | null
  empleado: string | null
  finalizado: boolean

  constructor() {
    super()
    this.id = null
    this.empleado = null
    this.finalizado = false
  }
}
