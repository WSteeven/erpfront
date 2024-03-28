import { TabOption } from 'components/tables/domain/TabOption'

export const tiposProcesosExamenes = {
  INGRESO: 'INGRESO',
  OCUPACIONALES: 'OCUPACIONALES',
  REINGRESO: 'REINGRESO',
  SALIDA: 'SALIDA',
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
    value: 'APROBADO_POR_COMPRAS',
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
  { label: 'Solicitudes de exámenes', value: estadosSolicitudesExamenes.SOLICITADO.value, icono: 'bi-arrow-right', color_icono: 'orange', bg_color: 'yellow-2', icono_derecha: true },
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
