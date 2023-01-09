import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ResumenTendido } from './ResumenTendido'

export const configuracionColumnasResumenTendido: ColumnConfig<ResumenTendido>[] = [
  {
    name: 'numero_elemento',
    field: 'numero_elemento',
    label: 'Número del elemento',
  },
  {
    name: 'tipo_elemento',
    field: 'tipo_elemento',
    label: 'Tipo elemento',
  },
  {
    name: 'estado_elemento',
    field: 'estado_elemento',
    label: 'Estado del elemento',
  },
]

