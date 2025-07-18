import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ResultadoHabitoToxico } from './ResultadoHabitoToxico'

export const configuracionColumnasResultadoHabitoToxico: ColumnConfig<ResultadoHabitoToxico>[] = [
  {
    name: 'tipo_habito_toxico',
    field: 'tipo_habito_toxico',
    label: 'Consumos nocivos',
    align: 'left',
    sortable: true
  },
  {
    name: 'consume',
    field: 'consume',
    label: '¿Es consumidor?',
    align: 'left',
    sortable: true,
    type: 'toggle',
    editable: true,
  },{
    name: 'tiempo_consumo_meses',
    field: 'tiempo_consumo_meses',
    label: 'Tiempo de consumo(meses)',
    align: 'left',
    sortable: true,
    type: 'text',
    editable: true,
  },
  {
    name: 'cantidad',
    field: 'cantidad',
    label: 'Cantidad',
    align: 'left',
    sortable: true,
    type: 'text',
    editable: true,
  },
  {
    name: 'ex_consumidor',
    field: 'ex_consumidor',
    label: 'Ex consumidor',
    align: 'left',
    sortable: true,
    type: 'boolean',
    editable: true,
  },
  {
    name: 'tiempo_abstinencia_meses',
    field: 'tiempo_abstinencia_meses',
    label: 'Tiempo abstinencia(meses)',
    align: 'left',
    sortable: true,
    type: 'text',
    editable: true,
  },
]
