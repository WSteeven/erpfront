import { TabOption } from 'components/tables/domain/TabOption'

export const tiposPrioridades = [
  { color: 'pink', label: 'ALTA' },
  { color: 'orange', label: 'MEDIA' },
  { color: 'positive', label: 'BAJA' },
  { color: 'negative', label: 'EMERGENCIA' },
]

export const estadosTickets = {
  SIN_ASIGNAR: 'SIN ASIGNAR',
  ASIGNADO: 'ASIGNADO',
  EJECUTANDO: 'EJECUTANDO',
  PAUSADO: 'PAUSADO',
  CANCELADO: 'CANCELADO',
  FINALIZADO_SIN_SOLUCION: 'FINALIZADO SIN SOLUCION',
  FINALIZADO_SOLUCIONADO: 'FINALIZADO SOLUCIONADO',
  CALIFICADO: 'CALIFICADO',
}

export const tabOptionsEstadosTickets: TabOption[] = [
  { label: 'Sin asignar', value: estadosTickets.SIN_ASIGNAR },
  { label: 'Asignado', value: estadosTickets.ASIGNADO },
  { label: 'Ejecutando', value: estadosTickets.EJECUTANDO },
  { label: 'Finalizado solucionado', value: estadosTickets.FINALIZADO_SOLUCIONADO },
  { label: 'Finalizado sin solución', value: estadosTickets.FINALIZADO_SIN_SOLUCION },
];
