import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ResultadoExamen } from './ResultadoExamen'

export class DetalleResultadoExamen extends EntidadAuditable {
  resultados_examenes: ResultadoExamen[]
  observacion: string | null
  estado_solicitud_examen: number | null

  constructor() {
    super()
    this.resultados_examenes = []
    this.observacion = null
    this.estado_solicitud_examen = null
  }
}
