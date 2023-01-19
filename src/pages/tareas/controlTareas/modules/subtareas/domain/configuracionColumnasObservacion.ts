import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import Observacion from './Observacion'

export const configuracionColumnasObservacion: ColumnConfig<Observacion>[] = [
  {
    name: 'observacion',
    field: 'observacion',
    label: 'Observación',
    align: 'left',
  },
]
