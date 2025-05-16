import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class EmpleadoDelegado extends EntidadAuditable {
  empleado: string | null
  delegado: string | null
  fecha_hora_desde: string | null
  fecha_hora_hasta: string | null
  activo: boolean

  constructor() {
    super()
    this.empleado = null
    this.delegado = null
    this.fecha_hora_desde = null
    this.fecha_hora_hasta = null
    this.activo = true
  }
}
