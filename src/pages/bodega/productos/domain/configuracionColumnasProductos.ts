import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import {Producto} from './Producto';

export const configuracionColumnasProductos: ColumnConfig<Producto>[]=[
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
  // add other fields of Product class
  // ...

]

