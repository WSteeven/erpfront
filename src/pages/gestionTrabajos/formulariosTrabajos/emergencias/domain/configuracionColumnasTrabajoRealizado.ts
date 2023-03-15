import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import TrabajoRealizado from './TrabajoRealizado'

export const configuracionColumnasTrabajoRealizado: ColumnConfig<TrabajoRealizado>[] = [
  {
    name: 'hora',
    field: 'hora',
    label: 'Hora',
    align: 'left',
    type: 'text',
    sortable: true,
    editable: false,
  },
  {
    name: 'actividad',
    field: 'actividad',
    label: 'Acción realizadas',
    align: 'left',
    type: 'text',
  },
]
