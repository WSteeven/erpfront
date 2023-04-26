import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasItemsSeleccionados: ColumnConfig<any>[] = [
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
    name: 'cliente_id',
    field: 'cliente_id',
    label: 'Propietario',
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
    name: 'condiciones',
    field: 'condiciones',
    label: 'Condición',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cantidades',
    field: 'cantidades',
    label: 'Cantidad',
    align: 'left',
    sortable: false,
  },
  {
    name: 'acciones',
    field: 'acciones',
    label: 'Acciones',
    align: 'center',
    sortable: false,
  }
]
