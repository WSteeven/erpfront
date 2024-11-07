import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class SolicitudVacacion extends EntidadAuditable {
  empleado: number | null
  autorizador: number | null
  autorizacion: number | null
  dias_solicitados: number|null
  periodo: string | null
  fecha_inicio: string | null
  fecha_fin: string | null
  estado: string | null
  reemplazo: number | null
  funciones: string | null

  constructor() {
    super()
    this.empleado = null
    this.autorizador = null
    this.autorizacion = null
    this.dias_solicitados = null
    this.periodo = null
    this.fecha_inicio = null
    this.fecha_fin = null
    this.estado = null
    this.reemplazo = null
    this.funciones = null
  }
}
