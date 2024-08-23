import { TabOption } from 'src/components/tables/domain/TabOption'

export const aniosExperiencia = [
  '3 meses',
  '6 meses',
  '1 año',
  '2 años',
  '3 años',
  '4 años',
  '5 años',
  '10 años',
  '15 años',
]


export const tabOptionsSolicitudesPersonal: TabOption[] = [
  { value: '1', label: 'PENDIENTES', },
  { value: '2', label: 'APROBADAS', },
  { value: '3', label: 'CANCELADAS', },
  { value: '4', label: 'PUBLICADAS', },
]


export const opcionesTablaVacantes = {
  inactivas: 'INACTIVAS',
  publicadas: 'PUBLICADAS',
  vigentes: 'VIGENTES',
  expiradas: 'EXPIRADAS',
}

export const tabOptionsVacantes: TabOption[] = [
  { value: opcionesTablaVacantes.publicadas, label: opcionesTablaVacantes.publicadas },
  { value: opcionesTablaVacantes.inactivas, label: opcionesTablaVacantes.inactivas },
  { value: opcionesTablaVacantes.vigentes, label: opcionesTablaVacantes.vigentes },
  { value: opcionesTablaVacantes.expiradas, label: opcionesTablaVacantes.expiradas },
]


export const estadosPostulacion = {
  POSTULADO: 'POSTULADO', // cuando el postulante registra su postulación
  REVISION_CV: 'REVISION CV', // cuando RRHH abre la postulación, esta opción se marca automaticamente y se notifica al postulante
  ENTREVISTA: 'EN ENTREVISTA',
  /**
   * Luego de la entrevista hay 3 posibles pasos
   * DESCARTADO -> cuando no se cumple las expectativas del puesto o del postulante
   * SELECCIONADO -> cuando se cumple las expectativas del puesto o del postulante y luego pasa a la fase de examenes medicos
   * EXAMENES MEDICOS -> cuando el postulante debe hacerse los examenes medicos para verificar si es contratable en tema de SALUD.
   * CONTRATADO -> cuando ha avanzado en todas las fases y automaticamente pasa a ser empleado de la empresa.
   * BANCO DE CANDIDATOS -> cuando no es apto para el puesto o si lo es pero no se continua el proceso ya que hay mejores prospectos o se cierra inesperadamente el proceso.
   * queda en banco de candidatos para ser llamado en un futuro proceso.
   *
   */
  DESCARTADO: 'DESCARTADO',
  SELECCIONADO: 'SELECCIONADO',
  EXAMENES_MEDICOS: 'EXAMENES MEDICOS',
  CONTRATADO: 'CONTRATADO',
  BANCO_DE_CANDIDATOS: 'BANCO DE CANDIDATOS',
  RECHAZADO: 'RECHAZADO', // cuando el perfil del postulante no aplica para el cargo ni para banco de candidatos
}

export const opcionesEstadosPostulaciones = [
  estadosPostulacion.POSTULADO,
  estadosPostulacion.REVISION_CV,
  estadosPostulacion.ENTREVISTA,
  estadosPostulacion.DESCARTADO,
  estadosPostulacion.SELECCIONADO,
  estadosPostulacion.EXAMENES_MEDICOS,
  estadosPostulacion.CONTRATADO,
  estadosPostulacion.BANCO_DE_CANDIDATOS,
  estadosPostulacion.RECHAZADO
]

export const likertCalificacionPostulante = [
  'EXCELENTE',
  'BUENO',
  'REGULAR'
]
export const likertCalificacionPostulacion = [
  'EXCELENTE',
  'BUENO',
  'REGULAR',
  'DEFICIENTE',
  'MUY DEFICIENTE',
]

export const tabOptionsEstadosPostulaciones: TabOption[] = [
  { value: estadosPostulacion.POSTULADO, label: estadosPostulacion.POSTULADO },
  { value: estadosPostulacion.REVISION_CV, label: estadosPostulacion.REVISION_CV },
  { value: estadosPostulacion.ENTREVISTA, label: estadosPostulacion.ENTREVISTA },
  { value: estadosPostulacion.DESCARTADO, label: estadosPostulacion.DESCARTADO },
  { value: estadosPostulacion.SELECCIONADO, label: estadosPostulacion.SELECCIONADO },
  { value: estadosPostulacion.EXAMENES_MEDICOS, label: estadosPostulacion.EXAMENES_MEDICOS },
  { value: estadosPostulacion.CONTRATADO, label: estadosPostulacion.CONTRATADO },
  { value: estadosPostulacion.BANCO_DE_CANDIDATOS, label: estadosPostulacion.BANCO_DE_CANDIDATOS },
  { value: estadosPostulacion.RECHAZADO, label: estadosPostulacion.RECHAZADO },
]
