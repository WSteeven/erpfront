import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class AutorizadorDirecto extends EntidadAuditable {
  empleado: string | null
  empleado_id: number | null
  autorizador: string | null
  autorizador_id: string | null
  observacion: string | null
  activo: boolean

  constructor() {
    super()
    this.empleado = null
    this.empleado_id = null
    this.autorizador = null
    this.autorizador_id = null
    this.observacion = null
    this.activo = true
  }
}
