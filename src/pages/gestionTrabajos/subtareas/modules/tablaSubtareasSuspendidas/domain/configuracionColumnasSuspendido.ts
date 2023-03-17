import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Suspendido } from './Suspendido'

export const configuracionColumnasSuspendido: ColumnConfig<Suspendido>[] = [
  {
    name: 'fecha_hora_suspendido',
    field: 'fecha_hora_suspendido',
    label: 'Fecha hora suspendido',
    align: 'left',
  },
  {
    name: 'motivo',
    field: 'motivo',
    label: 'Motivo',
    align: 'left',
  },
]
