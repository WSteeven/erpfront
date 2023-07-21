import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasSumaMaterial: ColumnConfig<any>[] = [
  {
    name: 'producto',
    field: 'producto',
    label: 'Producto',
    align: 'left',
  },
  {
    name: 'suma_total',
    field: 'suma_total',
    label: 'Suma total',
    align: 'center',
  },
]
