import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import Observacion from './Observacion'

export const configuracionColumnasObservacion: ColumnConfig<Observacion>[] = [
  {
    name: 'detalle',
    field: 'detalle',
    label: 'Detalle',
    align: 'left',
    sortable: true,
  },
]
