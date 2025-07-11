import { ResultadoExamenPreocupacional } from './ResultadoExamenPreocupacional'
import { AntecedenteGinecoObstetrico } from './AntecedenteGinecoObstetrico'
import { RevisionActualOrganoSistema } from './RevisionActualOrganoSistema'
import { AntecedenteTrabajoAnterior } from './AntecedenteTrabajoAnterior'
import { ResultadoHabitoToxico } from './ResultadoHabitoToxico'
import { FrPuestoTrabajoActual } from './FrPuestoTrabajoActual'
import { AntecedenteFamiliar } from './AntecedenteFamiliar'
import { AntecedentePersonal } from './AntecedentePersonal'
import { MedicacionHabitual } from './MedicacionHabitual'
import { ActividadFisica } from './ActividadFisica'
import { FichaMedica } from '../../seccionesFichas/domain/FichaMedica'
import { AptitudMedica } from '../../seccionesFichas/aptitudMedicaTrabajo/domain/AptitudMedica'

export class FichaPeriodicaPreocupacional extends FichaMedica {
  numero_archivo: number | null
  registro_empleado_examen: number | null
  empleado: string | null
  religion: number | null
  orientacion_sexual: number | null
  cargo: number | null
  identidad_genero: number | null
  lateralidad: string | null
  motivo_consulta: string | null
  grupo_sanguineo: string | null
  antecedente_clinico_quirurgico: string | null
  antecedentes_gineco_obstetricos: AntecedenteGinecoObstetrico
  antecedente_personal: AntecedentePersonal
  habitos_toxicos: ResultadoHabitoToxico[]
  actividades_fisicas: ActividadFisica[]
  medicaciones: MedicacionHabitual[]
  antecedentes_empleos_anteriores: AntecedenteTrabajoAnterior[]
  antecedentes_familiares: AntecedenteFamiliar[]
  fr_puestos_trabajos_actuales: FrPuestoTrabajoActual[]
  actividades_extralaborales: string | null
  enfermedad_actual: string | null
  revisiones_actuales_organos_sistemas: RevisionActualOrganoSistema[]
  antecedentes_clinicos_quirurgicos: string | null
  examenes_realizados: ResultadoExamenPreocupacional[]
  // resultados_examenes_preocupacionales: ResultadoExamenPreocupacional[]
  recomendaciones_tratamiento: string | null
  aptitud_medica: AptitudMedica

  constructor() {
    super()
    this.numero_archivo = null
    this.registro_empleado_examen = null
    this.religion = null
    this.orientacion_sexual = null
    this.identidad_genero = null
    this.cargo = null
    this.lateralidad = null
    this.motivo_consulta = null
    this.antecedente_clinico_quirurgico= null
    this.antecedentes_gineco_obstetricos = new AntecedenteGinecoObstetrico()
    this.antecedente_personal = new AntecedentePersonal()
    this.habitos_toxicos = []
    this.actividades_fisicas = []
    this.medicaciones = []
    this.antecedentes_empleos_anteriores = []
    this.antecedentes_familiares = []
    this.fr_puestos_trabajos_actuales = []
    this.actividades_extralaborales = null
    this.enfermedad_actual = null
    this.revisiones_actuales_organos_sistemas = []
    this.antecedentes_clinicos_quirurgicos = null
    this.examenes_realizados = []
    this.recomendaciones_tratamiento = null
    this.aptitud_medica = new AptitudMedica()
  }
}
