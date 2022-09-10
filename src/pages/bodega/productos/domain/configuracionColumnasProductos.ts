import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import {Producto} from './Producto';

export const configuracionColumnasProductos: ColumnConfig<Producto>[]=[
  {
    name:'categoria_id',
    field:'categoria_id',
    label:'left',
    sortable:true,
  },
  {
    name:'nombre_id',
    field:'nombre_id',
    label:'left',
    sortable:true,
  },
  // add other fields of Product class
  // ...

]

