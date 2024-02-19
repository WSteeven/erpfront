import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Cuestionario } from './Cuestionario'
export class RespuestaCuestionarioEmpleado extends EntidadAuditable {
  empleado: number | null
  empleado_info: string | null
  cuestionario: Cuestionario[]
  cuestionario_info: string | null

  constructor() {
    super()
    this.empleado = null
    this.empleado_info = null
    this.cuestionario = []
    this.cuestionario_info = null
  }
}
