import { ColumnConfig } from 'components/tables/domain/ColumnConfig';

export const configuracionColumnasProductosSeleccionados: ColumnConfig<any>[] = [
  {
    name: 'detalle',
    field: 'detalle',
    label: 'Detalle del material',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cantidad_despachada',
    field: 'cantidad_despachada',
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

