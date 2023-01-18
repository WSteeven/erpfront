import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Pausa } from './Pausa'
import TrabajoRealizado from './TrabajoRealizado'

export const configuracionColumnasTrabajoRealizado: ColumnConfig<TrabajoRealizado>[] = [
  {
    name: 'hora',
    field: 'hora',
    label: 'Hora',
    align: 'left',
    input_type: 'text',
    sortable: true,
    editable: false,
  },
  {
    name: 'actividad',
    field: 'actividad',
    label: 'Acciones realizadas',
    align: 'left',
    input_type: 'text',
  },
]
