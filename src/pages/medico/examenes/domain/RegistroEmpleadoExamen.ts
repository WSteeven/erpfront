import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class RegistroEmpleadoExamen extends EntidadAuditable {
  numero_registro: string | number | null
  observacion: string | null
  tipo_proceso_examen: string | null
  empleado: number | null

  constructor() {
    super()
    this.numero_registro = null
    this.observacion = null
    this.tipo_proceso_examen = null
    this.empleado = null
  }
}
