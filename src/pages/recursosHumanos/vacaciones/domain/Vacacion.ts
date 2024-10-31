import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Vacacion extends EntidadAuditable {
  empleado: number | null
  periodo: string | number | null
  periodo_id: number | null
  fecha_ingreso: string | null
  dias: number | null
  opto_pago: boolean
  detalles: []
  completadas: boolean
  dias_tomados: number
  dias_disponibles: number

  constructor() {
    super()
    this.empleado = null
    this.periodo = null
    this.periodo_id = null
    this.fecha_ingreso = null
    this.dias = 15
    this.detalles = []
    this.opto_pago = false
    this.completadas = false
    this.dias_tomados = 0
    this.dias_disponibles = 0
  }
}
