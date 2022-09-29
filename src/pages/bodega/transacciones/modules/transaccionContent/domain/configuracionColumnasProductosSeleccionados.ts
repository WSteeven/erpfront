import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import {Producto} from 'src/pages/bodega/productos/domain/Producto'

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
  {
    name:'cantidades',
    field:'cantidades',
    label:'Cantidades',
    align:'left',
    sortable:false,
  },
  // add other fields of Product class
  // ...

]

