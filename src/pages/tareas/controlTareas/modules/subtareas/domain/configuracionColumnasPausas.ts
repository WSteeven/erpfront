import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Pausa } from './Pausa'

export const configuracionColumnasPausas: ColumnConfig<Pausa>[] = [
  {
    name: 'fecha_hora_pausa',
    field: 'fecha_hora_pausa',
    label: 'Fecha hora pausa',
    align: 'left',
  },
  {
    name: 'fecha_hora_retorno',
    field: 'fecha_hora_retorno',
    label: 'Fecha hora retorno',
    align: 'left',
  },
  {
    name: 'tiempo_pausado',
    field: 'tiempo_pausado',
    label: 'Tiempo pausado',
    align: 'left',
  },
  {
    name: 'motivo',
    field: 'motivo',
    label: 'Motivo',
    align: 'left',
  },
]
