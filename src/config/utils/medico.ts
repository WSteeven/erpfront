import { TabOption } from "components/tables/domain/TabOption"

export const tiposProcesosExamenes = {
  INGRESO: 'INGRESO',
  OCUPACIONALES: 'OCUPACIONALES',
  REINGRESO: 'REINGRESO',
  SALIDA: 'SALIDA',
}

export const tiposEnfermedades = {
  PREEXISTENTES: 'Enfermedades preexistentes',
  COMUNES: 'Enfermedades comunes',
}

/*export const estadosExamenes = {
  PENDIENTE_SOLICITAR: 'PENDIENTE DE SOLICITAR',
  SOLICITADO: 'SOLICITUDES REALIZADAS',
  APROBADO_POR_COMPRAS: 'APROBADO_POR_COMPRAS',
  RESULTADOS: 'RESULTADOS DE EXÁMENES',
  DIAGNOSTICO_REALIZADO: 'DIAGNOSTICO_REALIZADO',
  APERTURA_FICHA_MEDICA: 'APERTURA_FICHA_MEDICA',
}*/

export const estadosExamenes = {
  PENDIENTE_SOLICITAR: {
    value: '0',
    label: 'Pendientes de solicitar',
    icono: 'bi-cart-plus',
  },
  SOLICITADO: {
    value: '1',
    label: 'Solicitudes de exámenes',
    icono: 'bi-cart-check',
  },
  APROBADO_POR_COMPRAS: {
    value: '2',
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

export const estadosCitaMedica = {
  PENDIENTE: 'PENDIENTE',
  AGENDADO: 'AGENDADO',
  ATENDIDO: 'ATENDIDO',
  CANCELADO: 'CANCELADO',
  RECHAZADO: 'RECHAZADO',
}

export const tabOptionsEstadosExamenes: TabOption[] = [
  { label: 'Pendientes de solicitar', value: estadosExamenes.PENDIENTE_SOLICITAR, icono: 'bi-arrow-right', color_icono: 'pink', bg_color: 'pink-1', icono_derecha: true },
  { label: 'Solicitudes de exámenes', value: estadosExamenes.SOLICITADO, icono: 'bi-arrow-right', color_icono: 'orange', bg_color: 'yellow-2', icono_derecha: true },
  { label: 'Aprobado por compras', value: estadosExamenes.APROBADO_POR_COMPRAS, icono: 'bi-arrow-right', color_icono: 'primary', bg_color: 'blue-2', icono_derecha: true },
  { label: 'Resultados', value: estadosExamenes.DIAGNOSTICO_REALIZADO, color_icono: 'positive' },
  // { label: 'Diagnóstico realizado', value: estadosExamenes.DIAGNOSTICO_REALIZADO, icono: 'bi-arrow-right', color_icono: 'positive', bg_color: 'light-green-1', icono_derecha: true },
  // { label: 'Apertura de ficha médica', value: estadosExamenes.APERTURA_FICHA_MEDICA, bg_color: 'light-green-2', color_icono: 'positive' },
]

export const tabOptionsEstadosCitaMedica: TabOption[] = [
  { label: 'Pendientes', value: estadosCitaMedica.PENDIENTE },
  { label: 'Agendados', value: estadosCitaMedica.AGENDADO },
  { label: 'Atendidos', value: estadosCitaMedica.ATENDIDO },
  { label: 'Cancelados', value: estadosCitaMedica.CANCELADO },
  { label: 'Rechazados', value: estadosCitaMedica.RECHAZADO },
]

