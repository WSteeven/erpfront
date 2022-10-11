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
  },
  {
    name: 'detalle',
    field: 'detalle',
    label: 'Actividad realizada',
    align: 'left',
    input_type: 'text',
    sortable: true,
  },
  {
    name: 'observacion',
    field: 'observacion',
    label: 'Observaciones/Mejoras/Pendientes',
    align: 'left',
    input_type: 'text',
    sortable: true,
  },
]
