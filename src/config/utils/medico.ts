import { TabOption } from "components/tables/domain/TabOption"

export const tiposProcesosExamenes = {
  INGRESO: 'INGRESO',
  OCUPACIONALES: 'OCUPACIONALES',
  REINGRESO: 'REINGRESO',
  SALIDA: 'SALIDA',
}

export const estadosExamenes = {
  PENDIENTE_SOLICITAR: '0',
  SOLICITADO: '1',
  APROBADO_POR_COMPRAS: '2',
  DIAGNOSTICO_REALIZADO: '3',
  APERTURA_FICHA_MEDICA: '4',
}

export const tabOptionsEstadosExamenes: TabOption[] = [
  { label: 'Pendientes de solicitar', value: estadosExamenes.PENDIENTE_SOLICITAR },
  { label: 'Solicitado', value: estadosExamenes.SOLICITADO },
  { label: 'Aprobado por compras', value: estadosExamenes.APROBADO_POR_COMPRAS, icono: 'bi-check-circle-fill', color_icono: 'positive', bg_color: 'light-green-2' },
  { label: 'Diagnóstico realizado', value: estadosExamenes.DIAGNOSTICO_REALIZADO },
  { label: 'Apertura de ficha médica', value: estadosExamenes.APERTURA_FICHA_MEDICA },
]

