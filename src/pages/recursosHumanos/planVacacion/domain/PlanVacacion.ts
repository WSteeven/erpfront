import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class PlanVacacion extends EntidadAuditable {
  empleado: number | null
  periodo: string | null
  periodo_id: number|null
  rangos: number | null
  dias_primer_rango: number | null
  dias_segundo_rango: number | null
  fecha_inicio: string | null
  fecha_fin: string | null
  fecha_inicio_primer_rango: string | null
  fecha_fin_primer_rango: string | null
  fecha_inicio_segundo_rango: string | null
  fecha_fin_segundo_rango: string | null

  constructor() {
    super()
    this.empleado = null
    this.periodo = null
    this.periodo_id = null
    this.rangos = 1
    this.dias_primer_rango = 0
    this.dias_segundo_rango = 0
    this.fecha_inicio = null
    this.fecha_fin = null
    this.fecha_inicio_primer_rango = null
    this.fecha_fin_primer_rango = null
    this.fecha_inicio_segundo_rango = null
    this.fecha_fin_segundo_rango = null
  }
}
