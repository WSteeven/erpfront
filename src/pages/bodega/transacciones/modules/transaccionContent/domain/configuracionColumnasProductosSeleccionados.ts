import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasProductosSeleccionados: ColumnConfig<any>[] = [
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Detalle del material',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cantidad_disponible',
    field: 'cantidad_disponible',
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

