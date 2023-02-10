import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasItemsSeleccionadosDevolver: ColumnConfig<any>[] = [
  {
    name: 'producto',
    field: 'producto',
    label: 'Producto',
    align: 'left',
    sortable: true,
  },
  {
    name: 'detalle_id',
    field: 'detalle_id',
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
    name: 'condicion',
    field: 'condicion',
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
    name: 'devuelto',
    field: 'devuelto',
    label: 'Devuelto',
    align: 'left',
    sortable: false,
  },
  {
    name: 'devolucion',
    field: 'devolucion',
    label: 'Devolucion',
    align: 'left',
    sortable: false,
  },
  {
    name: 'acciones',
    field: 'acciones',
    label: 'Acciones',
    align: 'right',
    sortable: false,
  }
]