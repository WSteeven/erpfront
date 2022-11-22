import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Pausa } from './Pausa'

export const configuracionColumnasPausas: ColumnConfig<Pausa>[] = [
  {
    name: 'fecha_hora_pausa',
    field: 'fecha_hora_pausa',
    label: 'Fecha hora pausa',
    align: 'left',
    sortable: true,
  },
  {
    name: 'fecha_hora_retorno',
    field: 'fecha_hora_retorno',
    label: 'Fecha hora retorno',
    align: 'left',
    sortable: true,
  },
  {
    name: 'motivo',
    field: 'motivo',
    label: 'Motivo',
    align: 'left',
    sortable: true,
  },
]
