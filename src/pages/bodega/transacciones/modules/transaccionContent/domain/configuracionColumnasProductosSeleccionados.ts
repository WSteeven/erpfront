import { ColumnConfig } from 'components/tables/domain/ColumnConfig';

export const configuracionColumnasProductosSeleccionados: ColumnConfig<any>[]=[
  {
    name:'codigo',
    field:'codigo',
    label:'Código JP',
    align: 'left',
    sortable:true,
  },
  {
    name:'nombre',
    field:'nombre',
    label:'Producto',
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

