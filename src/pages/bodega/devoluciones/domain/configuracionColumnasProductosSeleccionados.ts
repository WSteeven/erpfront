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
    editable:false,
    sortable: true,
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    align: 'left',
    editable:false,
    sortable: true,
  },
  {
    name: 'categoria',
    field: 'categoria',
    label: 'Categoria',
    align: 'left',
    editable:false,
    sortable: true,
  },
  {
    name: 'serial',
    field: 'serial',
    label: 'Serial',
    align: 'left',
    sortable: true,
    editable:false,
  },
  {
    name: 'cantidad',
    field: 'cantidad',
    label: 'Cantidad',
    align: 'left',
    sortable: true,
  },
  {
    name: 'devuelto',
    field: 'devuelto',
    label: 'Devuelto',
    align: 'left',
    sortable: true,
  }
]

