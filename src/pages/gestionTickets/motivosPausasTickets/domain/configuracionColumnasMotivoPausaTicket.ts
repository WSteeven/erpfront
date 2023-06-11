import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { MotivoPausaTicket } from './MotivoPausaTicket'

export const configuracionColumnasMotivoPausaTicket: ColumnConfig<MotivoPausaTicket>[] = [
  {
    name: 'motivo',
    field: 'motivo',
    label: 'Motivo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Activo',
    align: 'left',
  },
]
