import { ResultadoExamenPreocupacional } from './ResultadoExamenPreocupacional'
import { DescripcionAntecedenteTrabajo } from './DescripcionAntecedenteTrabajo'
import { AntecedenteGinecoObstetrico } from './AntecedenteGinecoObstetrico'
import { RevisionActualOrganoSistema } from './RevisionActualOrganoSistema'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { AntecedenteTrabajoAnterior } from './AntecedenteTrabajoAnterior'
import { ResultadoHabitoToxico } from './ResultadoHabitoToxico'
import { FrPuestoTrabajoActual } from './FrPuestoTrabajoActual'
import { AntecedenteFamiliar } from './AntecedenteFamiliar'
import { AntecedentePersonal } from './AntecedentePersonal'
import { MedicacionHabitual } from './MedicacionHabitual'
import { ActividadFisica } from './ActividadFisica'
import { FichaMedica } from '../../seccionesFichas/domain/FichaMedica'

export class FichaPeriodicaPreocupacional extends FichaMedica {
  numero_archivo: number | null
  registro_empleado_examen: number | null
  religion: number | null
  orientacion_sexual: number | null
  identidad_genero: number | null
  lateralidad: string | null
  motivo_consulta: string | null
  antecedente_gineco_obstetrico: AntecedenteGinecoObstetrico
  antecedente_personal: AntecedentePersonal
  resultados_habitos_toxicos: ResultadoHabitoToxico[]
  actividades_fisicas: ActividadFisica[]
  medicacion_habituales: MedicacionHabitual[]
  antecedentes_trabajos_anteriores: AntecedenteTrabajoAnterior[]
  antecedentes_familiares: AntecedenteFamiliar[]
  fr_puestos_trabajos_actuales: FrPuestoTrabajoActual[]
  actividades_extralaborales: string | null
  enfermedad_actual: string | null
  revisiones_actuales_organos_sistemas: RevisionActualOrganoSistema[]
  antecedentes_clinicos_quirurgicos: string | null
  resultados_examenes_preocupacionales: ResultadoExamenPreocupacional[]
  recomendaciones_tratamiento: string | null

  constructor() {
    super()
    this.numero_archivo = null
    this.registro_empleado_examen = null
    this.religion = null
    this.orientacion_sexual = null
    this.identidad_genero = null
    this.lateralidad = null
    this.motivo_consulta = null
    this.antecedente_gineco_obstetrico = new AntecedenteGinecoObstetrico()
    this.antecedente_personal = new AntecedentePersonal()
    this.resultados_habitos_toxicos = []
    this.actividades_fisicas = []
    this.medicacion_habituales = []
    this.antecedentes_trabajos_anteriores = []
    this.antecedentes_familiares = []
    this.fr_puestos_trabajos_actuales = []
    this.actividades_extralaborales = null
    this.enfermedad_actual = null
    this.revisiones_actuales_organos_sistemas = []
    this.antecedentes_clinicos_quirurgicos = null
    this.resultados_examenes_preocupacionales = []
    this.recomendaciones_tratamiento = null
  }
}
