import { ColumnConfig } from 'components/tables/domain/ColumnConfig';

export const configuracionColumnasProductosSeleccionados: ColumnConfig<any>[] = [
  {
    name: 'producto',
    field: 'producto',
    label: 'Detalle del material',
    align: 'left',
    sortable: true,
  },
  {
    name: 'stock_inicial',
    field: 'stock_inicial',
    label: 'Stock inicial ',
    align: 'left',
    sortable: false,
  },
  {
    name: 'utilizado',
    field: 'utilizado',
    label: 'Utilizado ',
    align: 'left',
    sortable: false,
  },
  /*{
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
  },*/
]

