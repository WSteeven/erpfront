import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class OpcionRespuestaTipoEvaluacionMedicaRetiro extends EntidadAuditable {
  respuesta: string | null
  tipo_evaluacion_medica_retiro: number | null
  ficha_aptitud: number | null

  constructor() {
    super()

    this.respuesta = null
    this.tipo_evaluacion_medica_retiro = null
    this.ficha_aptitud = null
  }
}
