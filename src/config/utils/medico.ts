import { TabOption } from 'components/tables/domain/TabOption'

export const tiposProcesosExamenes = {
  INGRESO: 'INGRESO',
  PERIODICO: 'PERIODICO',
  REINTEGRO: 'REINTEGRO',
  RETIRO: 'RETIRO',
}

export const tiposEnfermedades = {
  HISTORIAL_CLINICO: 'Historial clínico',
  COMUNES: 'Enfermedades comúnes',
  ACCIDENTE_TRABAJO: 'Accidente de trabajo',
}

/*export const estadosExamenes = {
  PENDIENTE_SOLICITAR: 'PENDIENTE DE SOLICITAR',
  SOLICITADO: 'SOLICITUDES REALIZADAS',
  APROBADO_POR_COMPRAS: 'APROBADO_POR_COMPRAS',
  RESULTADOS: 'RESULTADOS DE EXÁMENES',
  DIAGNOSTICO_REALIZADO: 'DIAGNOSTICO_REALIZADO',
  APERTURA_FICHA_MEDICA: 'APERTURA_FICHA_MEDICA',
}*/

/*******************
 * Solicitud examen
 *******************/
export const estadosSolicitudesExamenes = {
  PENDIENTE_SOLICITAR: {
    value: 'PENDIENTE_SOLICITAR',
    label: 'Pendientes de solicitar',
    icono: 'bi-cart-plus',
  },
  SOLICITADO: {
    value: 'SOLICITADO',
    label: 'Solicitudes de exámenes',
    icono: 'bi-cart-check',
  },
  APROBADO_POR_COMPRAS: {
    value: 'RESULTADOS DE EXAMENES',
    label: 'Aprobado por compras',
    icono: 'bi-cash-coin',
  },
  RESULTADOS: {
    value: '3',
    label: 'Resultados de exámenes',
    icono: 'bi-table',
  },
  DIAGNOSTICO_REALIZADO: {
    value: '4',
    label: 'Diagnostico realizado',
  },
  APERTURA_FICHA_MEDICA: {
    value: '5',
    label: 'Apertura de ficha médica',
  },
}

export const tabOptionsEstadosExamenes: TabOption[] = [
  { label: 'Pendientes de solicitar', value: estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value, icono: 'bi-arrow-right', color_icono: 'pink', bg_color: 'pink-1', icono_derecha: true },
  { label: 'Aprobado por compras', value: estadosSolicitudesExamenes.APROBADO_POR_COMPRAS.value, icono: 'bi-arrow-right', color_icono: 'primary', bg_color: 'blue-2', icono_derecha: true },
  { label: 'Solicitud de exámenes', value: estadosSolicitudesExamenes.SOLICITADO.value, icono: 'bi-arrow-right', color_icono: 'orange', bg_color: 'yellow-2', icono_derecha: true },
  { label: 'Resultados', value: estadosSolicitudesExamenes.DIAGNOSTICO_REALIZADO.value, color_icono: 'positive' },
  // { label: 'Diagnóstico realizado', value: estadosExamenes.DIAGNOSTICO_REALIZADO, icono: 'bi-arrow-right', color_icono: 'positive', bg_color: 'light-green-1', icono_derecha: true },
  // { label: 'Apertura de ficha médica', value: estadosExamenes.APERTURA_FICHA_MEDICA, bg_color: 'light-green-2', color_icono: 'positive' },
]

export const tabOptionsEstadosSolicitudExamen: TabOption[] = [
  { label: 'Pendientes de aprobar', value: estadosSolicitudesExamenes.SOLICITADO.value, icono: 'bi-cart-check', color_icono: 'orange', bg_color: 'yellow-2' },
  { label: 'Aprobados', value: estadosSolicitudesExamenes.APROBADO_POR_COMPRAS.value, icono: 'bi-cash-coin', color_icono: 'positive', bg_color: 'light-green-2' },
]

export const selectAprobarEstadosSolicitudesExamenes = [
  { label: 'Aprobado', value: estadosSolicitudesExamenes.APROBADO_POR_COMPRAS.value },
  { label: 'Solicitado', value: estadosSolicitudesExamenes.SOLICITADO.value },
]

/**************
 * Cita medica
 **************/
export const estadosCitaMedica = {
  PENDIENTE: 'PENDIENTE',
  AGENDADO: 'AGENDADO',
  ATENDIDO: 'ATENDIDO',
  CANCELADO: 'CANCELADO',
  RECHAZADO: 'RECHAZADO',
}

export const tabOptionsEstadosCitaMedica: TabOption[] = [
  { label: 'Pendientes', value: estadosCitaMedica.PENDIENTE },
  { label: 'Agendados', value: estadosCitaMedica.AGENDADO },
  { label: 'Atendidos', value: estadosCitaMedica.ATENDIDO },
  { label: 'Cancelados', value: estadosCitaMedica.CANCELADO },
  { label: 'Rechazados', value: estadosCitaMedica.RECHAZADO },
]

export const selectAgendarCitaMedicaMedico = [
  { label: 'Pendiente', value: estadosCitaMedica.PENDIENTE },
  { label: 'Agendado', value: estadosCitaMedica.AGENDADO },
  { label: 'Cancelar', value: estadosCitaMedica.CANCELADO },
  { label: 'Rechazar', value: estadosCitaMedica.RECHAZADO },
]

export const selectAgendarCitaMedicaPaciente = [
  { label: 'Pendiente', value: estadosCitaMedica.PENDIENTE },
  { label: 'Cancelar', value: estadosCitaMedica.CANCELADO },
]

export const opcionesDestinoCitaMedica = {
  PARA_MI: 'Para mi',
  PARA_OTRO_EMPLEADO: 'Para otro empleado',
}

// tipo de cita medica
export const tiposCitaMedica = {
  ENFERMEDAD_COMUN: {
    label: 'Enfermedad común',
    value: 'ENFERMEDAD COMUN',
  },
  ACCIDENTE_DE_TRABAJO: {
    label: 'Accidente de trabajo',
    value: 'ACCIDENTE DE TRABAJO',
  },
}

export const selectTipoCitaMedica = [
  { label: 'Enfermedad común', value: tiposCitaMedica.ENFERMEDAD_COMUN.value },
  { label: 'Accidente de trabajo', value: tiposCitaMedica.ACCIDENTE_DE_TRABAJO.value },
]

export const selectTipoCambioCargo = [
  { label: 'Temporal', value: 'TEMPORAL' },
  { label: 'Permanente', value: 'PERMANENTE' },
]

export const tiposFichasMedicas = {
  APTITUD: 'APTITUD',
  OCUPACIONAL: 'OCUPACIONAL',
}

export const tabOptionsTiposFichasMedicas: TabOption[] = [
  { label: 'Aptitud', value: tiposFichasMedicas.APTITUD, color_icono: 'pink', bg_color: 'pink-1' },
  { label: 'Períodico ocupacional', value: tiposFichasMedicas.OCUPACIONAL, color_icono: 'primary', bg_color: 'blue-2' },
]

export const opcionesTiposCuestionarios = {
  CUESTIONARIO_PSICOSOCIAL: 1,
  CUESTIONARIO_DIAGNOSTICO_CONSUMO_DE_DROGAS: 2,
}

export const opcionesPrivacidadCuestionarios = {
  INTERNO: 'INTERNO',
  PUBLICO: 'PUBLICO',
}

export const categoriasEnfermedades = {
  CATASTROFICAS: 'CATASTROFICAS',
  CRONICAS_NO_TRANSMISIBLES: 'CRONICAS NO TRANSMISIBLES',
  CRONICAS: 'CRONICAS',
  AGUDAS: 'AGUDAS',
}

export const enfermedades = [
  { nombre: 'TUMOR CEREBRAL', categoria: categoriasEnfermedades.CATASTROFICAS },
  { nombre: 'MALFORMACIONES', categoria: categoriasEnfermedades.CATASTROFICAS },
  { nombre: 'INSUFICIENCIA RENAL', categoria: categoriasEnfermedades.CATASTROFICAS },
  { nombre: 'TRANSPLANTES', categoria: categoriasEnfermedades.CATASTROFICAS },
  { nombre: 'INMUNOLOGIAS (LUPUS)', categoria: categoriasEnfermedades.CATASTROFICAS },
  { nombre: 'EZQUIZOFRENIA', categoria: categoriasEnfermedades.CATASTROFICAS },
  { nombre: 'CIRROSIS', categoria: categoriasEnfermedades.CATASTROFICAS },
  { nombre: 'SECUELAS DE QUEMADURAS GRAVES', categoria: categoriasEnfermedades.CATASTROFICAS },
  { nombre: 'DIABETES', categoria: categoriasEnfermedades.CRONICAS_NO_TRANSMISIBLES },
  { nombre: 'HIPERTENSION ARTERIAL', categoria: categoriasEnfermedades.CRONICAS_NO_TRANSMISIBLES },
  { nombre: 'OBESIDAD', categoria: categoriasEnfermedades.CRONICAS_NO_TRANSMISIBLES },
  { nombre: 'INFARTOS', categoria: categoriasEnfermedades.CRONICAS_NO_TRANSMISIBLES },
  { nombre: 'ECV (DERRAME CEREBRAL)', categoria: categoriasEnfermedades.CRONICAS_NO_TRANSMISIBLES },
  { nombre: 'ASMA', categoria: categoriasEnfermedades.CRONICAS_NO_TRANSMISIBLES },
  { nombre: 'CANCER', categoria: categoriasEnfermedades.CRONICAS_NO_TRANSMISIBLES },
  { nombre: 'VIH', categoria: categoriasEnfermedades.CRONICAS },
  { nombre: 'HEPATITIS B O C', categoria: categoriasEnfermedades.CRONICAS },
  { nombre: 'CONVULSIONES/EPILEPSIA', categoria: categoriasEnfermedades.CRONICAS },
  { nombre: 'VARICES', categoria: categoriasEnfermedades.CRONICAS },
  { nombre: 'GASTRITIS', categoria: categoriasEnfermedades.CRONICAS },
  { nombre: 'ULCERAS ESTOMACALES', categoria: categoriasEnfermedades.AGUDAS },
  { nombre: 'COLESTEROL/TRIGLICERIDOS', categoria: categoriasEnfermedades.AGUDAS },
  { nombre: 'ANSIEDAD', categoria: categoriasEnfermedades.AGUDAS },
  { nombre: 'NEUMONIAS FRECUENTES', categoria: categoriasEnfermedades.AGUDAS },
  { nombre: 'NINGUNA', categoria: null },
]

export const discapacidades = [
  'LENGUAJE',
  'PSICOSOCIAL',
  'VISUAL',
  'AUDITIVA',
  'FISICA',
  'INTELECTUAL',
  // 'NO APLICA',
]

export const generos = [
  'MASCULINO',
  'FEMENINO',
  'OTROS',
]