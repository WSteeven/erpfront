import { ResultadoExamenPreocupacional } from './ResultadoExamenPreocupacional'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasResultadoExamenPreocupacional: ColumnConfig<ResultadoExamenPreocupacional>[] = [
  {
    name: 'examen',
    field: 'examen',
    label: 'Exámenes realizados',
    align: 'left',
    sortable: true
  },
  {
    name: 'se_realizo_examen',
    field: 'se_realizo_examen',
    label: '¿Se realizo examen?',
    align: 'left',
    type: 'boolean',
    sortable: true,
    editable: true,
  },
  {
    name: 'tiempo',
    field: 'tiempo',
    label: 'Fecha Realización',
    align: 'left',
    sortable: true,
    type: 'text',
    editable: true,
  },
  {
    name: 'resultado',
    field: 'resultado',
    label: 'Resultado',
    align: 'left',
    sortable: true,
    type: 'text',
    editable:true,
  },
]
