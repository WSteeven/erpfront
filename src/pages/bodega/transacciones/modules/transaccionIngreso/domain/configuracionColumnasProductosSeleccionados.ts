import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { DetalleProducto } from 'pages/bodega/detalles_productos/domain/DetalleProducto';

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
  /* {
    name: 'precio_compra',
    field: 'precio_compra',
    label: 'P. Compra',
    align: 'left',
    input_type:'number',
    sortable: true,
    editable: true,
    visible: true
  }, */
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

