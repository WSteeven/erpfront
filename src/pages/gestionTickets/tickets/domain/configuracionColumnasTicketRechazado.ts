import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TicketRechazado } from './TicketRechazado'

export const configuracionColumnasTicketRechazado: ColumnConfig<TicketRechazado>[] = [
  {
    name: 'fecha_hora',
    field: 'fecha_hora',
    label: 'Fecha hora',
    align: 'left',
  },
  {
    name: 'motivo',
    field: 'motivo',
    label: 'Motivo',
    align: 'left',
  },
  {
    name: 'responsable',
    field: 'responsable',
    label: 'Responsable',
    align: 'left',
  },
]
