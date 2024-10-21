import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Vacacion extends EntidadAuditable {
  empleado: number | null
  periodo: number| null
  fecha_ingreso: string | null
  dias: number|null
  opto_pago: boolean
  completadas: boolean
  dias_tomados: int
  dias_disponibles: int

  constructor() {
    super()
    this.empleado = null
    this.periodo = null
    this.fecha_ingreso = null
    this.dias = null
    this.opto_pago = false
    this.completadas = false
    this.dias_tomados = 0
    this.dias_disponibles = 0
  }
}
