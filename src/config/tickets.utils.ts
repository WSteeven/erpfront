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
  PENDIENTE: 'PENDIENTE', // Se usa en vez de ASIGNADO en el dashboard
  REASIGNADO: 'REASIGNADO',
  EJECUTANDO: 'EJECUTANDO',
  PAUSADO: 'PAUSADO',
  CANCELADO: 'CANCELADO',
  FINALIZADO_SIN_SOLUCION: 'FINALIZADO SIN SOLUCIÓN',
  FINALIZADO: 'FINALIZADO',
  FINALIZADO_SOLUCIONADO: 'FINALIZADO SOLUCIONADO',
  ETIQUETADOS_A_MI: 'ETIQUETADOS_A_MI',
}

export const tabOptionsEstadosTickets: TabOption[] = [
  { label: 'Asignado', value: estadosTickets.ASIGNADO },
  { label: 'Reasignado', value: estadosTickets.REASIGNADO },
  { label: 'Ejecutando', value: estadosTickets.EJECUTANDO },
  { label: 'Pausado', value: estadosTickets.PAUSADO },
  { label: 'Finalizado solucionado', value: estadosTickets.FINALIZADO_SOLUCIONADO },
  { label: 'Finalizado sin solución', value: estadosTickets.FINALIZADO_SIN_SOLUCION },
  { label: 'Cancelado', value: estadosTickets.CANCELADO },
  { label: 'Rechazado', value: estadosTickets.RECHAZADO },
]

export const tabOptionsEstadosTicketsAsignados: TabOption[] = [
  { label: 'Asignado', value: estadosTickets.ASIGNADO },
  { label: 'Reasignado', value: estadosTickets.REASIGNADO },
  { label: 'Ejecutando', value: estadosTickets.EJECUTANDO },
  { label: 'Pausado', value: estadosTickets.PAUSADO },
  { label: 'Finalizado solucionado', value: estadosTickets.FINALIZADO_SOLUCIONADO },
  { label: 'Finalizado sin solución', value: estadosTickets.FINALIZADO_SIN_SOLUCION },
  { label: 'Rechazado', value: estadosTickets.RECHAZADO },
  { label: 'Etiquetados a mi', value: estadosTickets.ETIQUETADOS_A_MI, icono: 'people' },
  // { label: 'Calificado', value: estadosTickets.CALIFICADO },
]
