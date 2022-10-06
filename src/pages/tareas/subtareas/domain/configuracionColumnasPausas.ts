import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Pausa } from './Pausa'

export const configuracionColumnasPausas: ColumnConfig<Pausa>[] = [
  {
    name: 'fecha_pausa',
    field: 'fecha_pausa',
    label: 'Fecha pausa',
    align: 'left',
    sortable: true,
  },
  {
    name: 'hora_pausa',
    field: 'hora_pausa',
    label: 'Hora pausa',
    align: 'left',
    sortable: true,
  },
  {
    name: 'fecha_retorno',
    field: 'fecha_retorno',
    label: 'Fecha retorno',
    align: 'left',
    sortable: true,
  },
  {
    name: 'hora_retorno',
    field: 'hora_retorno',
    label: 'Hora retorno',
    align: 'left',
    sortable: true,
  },
  {
    name: 'detalle',
    field: 'detalle',
    label: 'Detalle',
    align: 'left',
    sortable: true,
  },
]
