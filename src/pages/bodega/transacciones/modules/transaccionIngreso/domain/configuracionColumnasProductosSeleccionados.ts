import { ColumnConfig } from 'components/tables/domain/ColumnConfig';

export const configuracionColumnasProductosSeleccionados: ColumnConfig<any>[] = [
  {
    name: 'producto',
    field: 'producto',
    label: 'Producto',
    align: 'left',
    sortable: true,
    visible:true,
    editable:false,
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    align: 'left',
    sortable: true,
    visible:true,
    editable:false,
  },
  {
    name: 'categoria',
    field: 'categoria',
    label: 'Categoria',
    align: 'left',
    sortable: true,
    visible:true,
    editable:false,
  },
  /* {
    name: 'condicion',
    field: 'condicion',
    label: 'Estado',
    align: 'left',
    sortable: false,
    editable:true,
    /* options:[{value:1, label:'opcion1'},
    {value:2, label:'opcion2'}
  ] 
  }, */
  /* {
    name: 'cantidad',
    field: 'cantidad',
    label: 'Cantidades',
    align: 'left',
    sortable: false,
  },
  {
    name: 'acciones',
    field: 'acciones',
    label: 'Acciones',
    align: 'right',
    sortable: false,
  } */
]

