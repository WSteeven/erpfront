import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { DetalleResultadoExamen } from './DetalleResultadoExamen'

export class ResultadoExamen extends EntidadAuditable {
  resultado: number | null
  fecha_examen: string | null
  configuracion_examen_campo: number | null
  estado_solicitud_examen: number | null

  constructor() {
    super()
    this.resultado = null
    this.fecha_examen = null
    this.configuracion_examen_campo = null
    this.estado_solicitud_examen = null
  }
}
