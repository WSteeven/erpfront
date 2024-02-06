import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class RespuestaCuestionarioEmpleado extends EntidadAuditable {
  empleado: number | null
  empleado_info: string | null
  cuestionario: any
  cuestionario_info: string | null

  constructor() {
    super()
    this.empleado = null
    this.empleado_info = null
    this.cuestionario = null
    this.cuestionario_info = null
  }
}
