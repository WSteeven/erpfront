import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Asistencia extends EntidadAuditable {
  empleado: number | null
  empleado_id: number | null
  fecha: string | null
  marcaciones: any

  constructor() {
    super()
    this.empleado = null
    this.empleado_id = null
    this.fecha = null
    this.marcaciones = null
  }
}
