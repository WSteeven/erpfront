import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Pausa } from './Pausa'
import TrabajoRealizado from './TrabajoRealizado'

export const configuracionColumnasTrabajoRealizado: ColumnConfig<TrabajoRealizado>[] = [
  {
    name: 'hora',
    field: 'hora',
    label: 'Hora',
    align: 'left',
    sortable: true,
  },
  {
    name: 'detalle',
    field: 'detalle',
    label: 'Detalle',
    align: 'left',
    sortable: true,
  },
]
