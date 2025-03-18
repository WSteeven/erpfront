import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { GeneradorCash } from './GeneradorCash'

export const configuracionColumnasGeneradorCash: ColumnConfig<GeneradorCash>[] = [
  {
    name: 'titulo',
    field: 'titulo',
    label: 'Titulo',
    align: 'left',
  },
  {
    name: 'valor_total',
    field: 'valor_total',
    label: 'Valor total ($)',
    align: 'left',
  },
  {
    name: 'total_pagos',
    field: 'total_pagos',
    label: 'Total de pagos',
    align: 'left',
  },
  {
    name: 'creador',
    field: 'creador',
    label: 'Creador',
    align: 'left',
  },
  {
    name: 'created_at',
    field: 'created_at',
    label: 'Fecha de creación',
    align: 'left',
  },
  {
    name: 'updated_at',
    field: 'updated_at',
    label: 'Fecha de actualización',
    align: 'left',
  },
]
