import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasListadoProductosSeleccionados: ColumnConfig<any>[] = [
  {
    name: 'producto',
    field: 'producto',
    label: 'Producto',
    align: 'left',
    sortable: true,
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    align: 'left',
    sortable: true,
  },
  {
    name: 'categoria',
    field: 'categoria',
    label: 'Categoria',
    align: 'left',
    sortable: true,
  },
  {
    name: 'serial',
    field: 'serial',
    label: 'Serial',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cantidad',
    field: 'cantidad',
    label: 'Cantidad pendiente',
    align: 'left',
    sortable: false,
  },
  {
    name: 'despachado',
    field: 'despachado',
    label: 'Despachado',
    align: 'left',
    sortable: false,
  },
]

