import { ResultadoExamenPreocupacional } from './ResultadoExamenPreocupacional'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasResultadoExamenPreocupacional: ColumnConfig<ResultadoExamenPreocupacional>[] = [
  {
    name: 'tipo_antecedente',
    field: 'tipo_antecedente',
    label: 'Exámenes realizados',
    align: 'left',
    sortable: true
  },
  {
    name: 'tiempo',
    field: 'tiempo',
    label: 'Tiempo(años)',
    align: 'left',
    sortable: true,
    type: 'number',
    editable: true,
  },
  {
    name: 'resultado',
    field: 'resultado',
    label: 'Resultado',
    align: 'left',
    sortable: true,
    type: 'text',
    editable: true,
  },
]
