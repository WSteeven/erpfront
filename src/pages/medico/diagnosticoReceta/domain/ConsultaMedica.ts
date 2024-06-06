import { ConstanteVital } from 'pages/medico/gestionarPacientes/modules/seccionesFichas/domain/ConstanteVital'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { DiagnosticoCitaMedica } from './DiagnosticoCitaMedica'
import { Receta } from './Receta'

export class ConsultaMedica extends EntidadAuditable {
  evolucion: string | null
  examen_fisico: string | null
  cita_medica: number | null
  registro_empleado_examen: number | null
  diagnosticos: DiagnosticoCitaMedica[]
  receta: Receta
  tipo_cita_medica: string | null
  dado_alta: boolean
  fecha_hora_solicitud: string | null
  dias_descanso: number | null
  constante_vital: ConstanteVital

  constructor() {
    super()
    this.evolucion = null
    this.examen_fisico = null
    this.cita_medica = null
    this.registro_empleado_examen = null
    this.diagnosticos = []
    this.receta = new Receta()
    this.tipo_cita_medica = null
    this.dado_alta = false
    this.fecha_hora_solicitud = null
    this.dias_descanso = null
    this.constante_vital = new ConstanteVital()
  }
}
