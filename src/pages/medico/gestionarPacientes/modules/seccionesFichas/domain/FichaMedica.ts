import { DescripcionAntecedenteTrabajo } from '../../fichaPeriodicaPreocupacional/domain/DescripcionAntecedenteTrabajo'
import { AptitudMedica } from '../aptitudMedicaTrabajo/domain/AptitudMedica'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ConstanteVital } from './ConstanteVital'
import { ExamenFisicoRegional } from '../examenFisicoRegional/domain/ExamenFisicoRegional'

export class FichaMedica extends EntidadAuditable {
  cargo: number | null
  aptitud_medica: AptitudMedica
  accidente_trabajo: DescripcionAntecedenteTrabajo
  enfermedad_profesional: DescripcionAntecedenteTrabajo
  constante_vital: ConstanteVital
  examenes_fisicos_regionales: ExamenFisicoRegional[]
  motivo_consulta: string | null
  registro_empleado_examen: number | null
  tiene_accidente_trabajo: boolean
  tiene_enfermedad_profesional: boolean

  constructor() {
    super()
    this.cargo = null
    this.aptitud_medica = new AptitudMedica()
    this.accidente_trabajo = new DescripcionAntecedenteTrabajo()
    this.enfermedad_profesional = new DescripcionAntecedenteTrabajo()
    this.constante_vital = new ConstanteVital()
    this.examenes_fisicos_regionales = []
    this.registro_empleado_examen = null
    this.motivo_consulta = null
    this.tiene_accidente_trabajo = false
    this.tiene_enfermedad_profesional = false
  }
}
