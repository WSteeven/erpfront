import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Producto } from 'pages/bodega/productos/domain/Producto';

export const configuracionColumnasProductos: ColumnConfig<Producto>[] = [
  {
    name: 'id',
    field: 'id',
    label: 'N°',
    align: 'left',
    sortable: true,
  },
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Producto',
    align: 'left',
    sortable: true,
  },
  {
    name: 'categoria',
    field: 'categoria',
    label: 'Categoria',
    align: 'left',
    sortable: true,
  },
  {
    name: 'unidad_medida',
    field: 'unidad_medida',
    label: 'U. Medida',
    align: 'left',
    sortable: true,
  },
] 