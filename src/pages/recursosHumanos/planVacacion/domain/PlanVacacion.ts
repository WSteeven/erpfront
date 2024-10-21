import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class PlanVacacion extends EntidadAuditable {
  empleado: number | null

  constructor() {
    super()
    this.empleado = null
  }
}
