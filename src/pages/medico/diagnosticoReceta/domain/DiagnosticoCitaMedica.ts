import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class DiagnosticoCitaMedica extends EntidadAuditable {
  cie: number | null
  cita_medica: number | null
  registro_empleado_examen: number | null
  recomendacion: string | null
  diagnosticos: DiagnosticoCitaMedica[]

  constructor() {
    super()
    this.cie = null
    this.cita_medica = null
    this.registro_empleado_examen = null
    this.recomendacion = null
    this.diagnosticos = []
  }
}
