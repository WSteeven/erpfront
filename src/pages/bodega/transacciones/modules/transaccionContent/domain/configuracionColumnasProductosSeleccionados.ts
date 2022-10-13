import { ColumnConfig } from 'components/tables/domain/ColumnConfig';

export const configuracionColumnasProductosSeleccionados: ColumnConfig<any>[]=[
  {
    name:'producto',
    field:'producto',
    label:'Producto',
    align: 'left',
    sortable:true,
  },
  {
    name:'descripcion',
    field:'descripcion',
    label:'descripcion',
    align: 'left',
    sortable:true,
  },
  {
    name:'categoria',
    field:'categoria',
    label:'Categoria',
    align:'left',
    sortable:true,
  },
]

