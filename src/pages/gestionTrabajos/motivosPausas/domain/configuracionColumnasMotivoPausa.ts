import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { MotivoPausa } from './MotivoPausa'

export const configuracionColumnasMotivoPausa: ColumnConfig<MotivoPausa>[] = [
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
