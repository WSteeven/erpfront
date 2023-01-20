import { ColumnConfig } from 'components/tables/domain/ColumnConfig';

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
]

