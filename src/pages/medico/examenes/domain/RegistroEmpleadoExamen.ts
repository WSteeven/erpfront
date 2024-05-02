import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class RegistroEmpleadoExamen extends EntidadAuditable {
  numero_registro: string | number | null
  observacion: string | null
  tipo_proceso_examen: string | null
  empleado: number | null
  ficha_aptitud: number | null
  ficha_periodica: number | null
  ficha_preocupacional: number | null
  ficha_retiro: number | null

  constructor() {
    super()
    this.numero_registro = null
    this.observacion = null
    this.tipo_proceso_examen = null
    this.empleado = null
    this.ficha_aptitud = null
    this.ficha_periodica = null
    this.ficha_preocupacional = null
    this.ficha_retiro = null
  }
}
