import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { MaterialOcupado } from './MaterialOcupado'

export const configuracionColumnasMaterialOcupado: ColumnConfig<MaterialOcupado>[] = [
  {
    name: 'detalle',
    field: 'detalle',
    label: 'Detalle del material',
    align: 'left',
    sortable: true,
  },
  {
    name: 'stock_actual',
    field: 'stock_actual',
    label: 'Cantidad disponible',
    align: 'left',
    sortable: false,
  },
  {
    name: 'cantidad_utilizada',
    field: 'cantidad_utilizada',
    label: 'Cantidad utilizada',
    align: 'left',
    sortable: false,
  },
]

