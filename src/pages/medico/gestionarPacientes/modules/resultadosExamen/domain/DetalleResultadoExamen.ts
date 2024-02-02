import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ResultadoExamen } from './ResultadoExamen'

export class DetalleResultadoExamen extends EntidadAuditable {
  resultados_examenes: ResultadoExamen[]
  observacion: string | null

  constructor() {
    super()
    this.resultados_examenes = []
    this.observacion = null
  }
}
