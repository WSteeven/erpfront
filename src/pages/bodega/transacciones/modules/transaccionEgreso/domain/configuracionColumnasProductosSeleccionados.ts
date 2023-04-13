import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasProductosSeleccionados: ColumnConfig<any>[] = [
  {
    name: 'producto',
    field: 'producto',
    label: 'Producto',
    align: 'left',
    sortable: true,
    editable: false,
    visible: true
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    align: 'left',
    sortable: true,
    editable: false,
    visible: true
  },
  {
    name: 'categoria',
    field: 'categoria',
    label: 'Categoria',
    align: 'left',
    sortable: true,
    editable: false,
    visible: true
  },
  {
    name: 'serial',
    field: 'serial',
    label: 'Serial',
    align: 'left',
    sortable: true,
    editable: false,
    visible: true
  },
  {
    name: 'condiciones',
    field: 'condiciones',
    label: 'Estado del producto',
    align: 'left',
    sortable: false,
    editable: false,
  },
]

