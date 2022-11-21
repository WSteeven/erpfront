import { ColumnConfig } from 'components/tables/domain/ColumnConfig';

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
    name: 'cantidades',
    field: 'cantidades',
    label: 'Cantidades',
    align: 'left',
    sortable: false,
  },
]

