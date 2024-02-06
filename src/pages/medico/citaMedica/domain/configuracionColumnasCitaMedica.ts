import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { CitaMedica } from './CitaMedica'

export const configuracionColumnasCitaMedica: ColumnConfig<CitaMedica>[] = [
  {
    name: 'motivo',
    field: 'motivo',
    label: 'Motivo',
    align: 'left',
    sortable: true,
  },
]
