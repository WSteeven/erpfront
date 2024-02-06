import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class RespuestaCuestionarioEmpleado extends EntidadAuditable {
  empleado: number | null
  empleado_info: string | null
  pregunta: number | null
  pregunta_info: string | null
  respuesta: number | null
  respuesta_info: string | null

  constructor() {
    super()
    this.empleado = null
    this.empleado_info = null
    this.pregunta = null
    this.pregunta_info = null
    this.respuesta = null
    this.respuesta_info = null
  }
}
