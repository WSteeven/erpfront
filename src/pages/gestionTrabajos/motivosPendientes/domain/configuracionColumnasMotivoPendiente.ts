import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { MotivoPendiente } from './MotivoPendiente'

export const configuracionColumnasMotivoPendiente: ColumnConfig<MotivoPendiente>[] = [
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
