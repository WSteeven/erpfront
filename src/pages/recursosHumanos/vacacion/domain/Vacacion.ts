import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Vacacion extends EntidadAuditable {
  id: number | null
  empleado: number | null
  autorizador: number | null
  empleado_info: string | null
  periodo: string | null
  periodo_info: string | null
  derecho_vacaciones: number | null
  id_jefe_inmediato: number | null
  descuento_vacaciones: number | null
  fecha_inicio: string | null
  fecha_fin: string | null
  fecha_inicio_rango1_vacaciones: string | null
  fecha_fin_rango1_vacaciones: string | null
  fecha_inicio_rango2_vacaciones: string | null
  fecha_fin_rango2_vacaciones: string | null
  estado: string | null
  numero_rangos: number | string | null
  numero_dias: number | null
  numero_dias_rango1: number | null
  numero_dias_rango2: number | null
  reemplazo: number | null
  funciones: string | null

  constructor() {
    super()
    this.id = null
    this.empleado = null
    this.autorizador = null
    this.empleado_info = null
    this.periodo = null
    this.periodo_info = null
    this.derecho_vacaciones = null
    this.descuento_vacaciones = null
    this.fecha_inicio = null
    this.fecha_fin = null
    this.fecha_inicio_rango1_vacaciones = null
    this.fecha_fin_rango1_vacaciones = null
    this.fecha_inicio_rango2_vacaciones = null
    this.fecha_fin_rango2_vacaciones = null
    this.id_jefe_inmediato = null
    this.estado = null
    this.numero_rangos = 1
    this.numero_dias = null
    this.numero_dias_rango1 = null
    this.numero_dias_rango2 = null
    this.reemplazo = null
    this.funciones = null
  }
}
