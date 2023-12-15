import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasProductosSeleccionados: ColumnConfig<any>[] = [
  {
    name: 'id',
    field: 'id',
    label: 'Id',
    align: 'left',
    sortable: true,
    editable: false,
    visible: false
  },
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
    label: 'Cantidad',
    align: 'left',
    sortable: true,
  },
]

