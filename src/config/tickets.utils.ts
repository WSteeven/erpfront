import { TabOption } from 'components/tables/domain/TabOption'

export const tiposPrioridades = [
  { color: 'pink', label: 'ALTA' },
  { color: 'orange', label: 'MEDIA' },
  { color: 'positive', label: 'BAJA' },
  { color: 'negative', label: 'EMERGENCIA' },
]

export const estadosTickets = {
  RECHAZADO: 'RECHAZADO',
  ASIGNADO: 'ASIGNADO',
  REASIGNADO: 'REASIGNADO',
  EJECUTANDO: 'EJECUTANDO',
  PAUSADO: 'PAUSADO',
  CANCELADO: 'CANCELADO',
  FINALIZADO_SIN_SOLUCION: 'FINALIZADO SIN SOLUCIÓN',
  FINALIZADO_SOLUCIONADO: 'FINALIZADO SOLUCIONADO',
  CALIFICADO: 'CALIFICADO',
}

export const tabOptionsEstadosTickets: TabOption[] = [
  { label: 'Rechazado', value: estadosTickets.RECHAZADO },
  { label: 'Asignado', value: estadosTickets.ASIGNADO },
  { label: 'Reasignado', value: estadosTickets.REASIGNADO },
  { label: 'Ejecutando', value: estadosTickets.EJECUTANDO },
  { label: 'Pausado', value: estadosTickets.PAUSADO },
  { label: 'Finalizado solucionado', value: estadosTickets.FINALIZADO_SOLUCIONADO },
  { label: 'Finalizado sin solución', value: estadosTickets.FINALIZADO_SIN_SOLUCION },
  { label: 'Calificado', value: estadosTickets.CALIFICADO },
]

export const tabOptionsEstadosTicketsAsignados: TabOption[] = [
  { label: 'Asignado', value: estadosTickets.ASIGNADO },
  { label: 'Reasignado', value: estadosTickets.REASIGNADO },
  { label: 'Ejecutando', value: estadosTickets.EJECUTANDO },
  { label: 'Pausado', value: estadosTickets.PAUSADO },
  { label: 'Finalizado solucionado', value: estadosTickets.FINALIZADO_SOLUCIONADO },
  { label: 'Finalizado sin solución', value: estadosTickets.FINALIZADO_SIN_SOLUCION },
  { label: 'Calificado', value: estadosTickets.CALIFICADO },
]
