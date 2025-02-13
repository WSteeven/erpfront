import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Asistencia extends EntidadAuditable {
  empleado: number | null
  fecha: Date | null
  marcaciones: any

  constructor() {
    super()
    this.empleado = null
    this.fecha = null
    this.marcaciones = null
  }
}
