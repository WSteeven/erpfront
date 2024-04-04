import { OpcionRespuestaTipoEvaluacionMedicaRetiro } from './OpcionRespuestaTipoEvaluacionMedicaRetiro'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class FichaAptitud extends EntidadAuditable {
  recomendaciones: string | null
  observaciones_aptitud_medica: string | null
  firmado_profesional_salud: boolean
  firmado_paciente: boolean
  registro_empleado_examen: number | null
  tipo_aptitud_medica_laboral: number | null
  profesional_salud: number | null
  opciones_respuestas_tipo_evaluacion_medica_retiro: OpcionRespuestaTipoEvaluacionMedicaRetiro[]

  constructor() {
    super()

    this.recomendaciones = null
    this.observaciones_aptitud_medica = null
    this.firmado_profesional_salud = false
    this.firmado_paciente = false
    this.registro_empleado_examen = null
    this.tipo_aptitud_medica_laboral = null
    this.profesional_salud = null
    this.opciones_respuestas_tipo_evaluacion_medica_retiro = []
  }
}
