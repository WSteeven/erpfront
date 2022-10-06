import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import Material from './Material'

export const configuracionColumnasMaterial: ColumnConfig<Material>[] = [
  {
    name: 'producto',
    field: 'producto',
    label: 'Producto',
    align: 'left',
    sortable: true,
  },
  {
    name: 'medida',
    field: 'medida',
    label: 'Medida',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cantidad_usada',
    field: 'cantidad_usada',
    label: 'Cantidad usada',
    align: 'left',
    sortable: true,
  },
]
