import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Vacacion extends EntidadAuditable {
  id: number | null
  empleado: number | null
  empleado_info: string | null
  periodo: string | null
  periodo_info: string | null
  derecho_vacaciones: string | null
  id_jefe_inmediato:number | null
  descuento_vacaciones: string |null
  fecha_inicio: string | null
  fecha_fin: string | null
  fecha_inicio_rango1_vacaciones: string |null
  fecha_fin_rango1_vacaciones: string |null
  fecha_inicio_rango2_vacaciones: string |null
  fecha_fin_rango2_vacaciones: string |null
  solicitud:string |null
  estado: string | null
  constructor() {
    super()
    this.id = null
    this.empleado = null
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
    this.solicitud = null
    this.id_jefe_inmediato = null
    this.estado = null
  }
}
