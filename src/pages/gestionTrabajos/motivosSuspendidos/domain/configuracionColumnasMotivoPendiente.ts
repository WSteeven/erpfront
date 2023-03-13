import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { MotivoSuspendido } from './MotivoSuspendido'

export const configuracionColumnasMotivoPendiente: ColumnConfig<MotivoSuspendido>[] = [
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
