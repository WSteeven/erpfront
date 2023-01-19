import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import {Producto} from './Producto';

export const configuracionColumnasProductos: ColumnConfig<Producto>[]=[
  {
    name:'cantidad',
    field:'cantidad',
    label:'Cantidad',
    align: 'left',
    sortable:true,
  },
  {
    name:'unidad_medida',
    field:'unidad_medida',
    label:'U. Medida',
    align: 'left',
    sortable:true,
  },
  {
    name:'nombre',
    field:'nombre',
    label:'Producto',
    align: 'left',
    sortable:true,
    style: 'width:500px'
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

