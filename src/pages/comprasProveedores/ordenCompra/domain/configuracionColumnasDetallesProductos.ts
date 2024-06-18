import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { DetalleProducto } from 'pages/bodega/detalles_productos/domain/DetalleProducto';

export const configuracionColumnasDetallesProductos: ColumnConfig<DetalleProducto>[] = [
  {
    name: 'id',
    field: 'id',
    label: 'N°',
    align: 'left',
    sortable: true,
  },
  {
    name: 'producto',
    field: 'producto',
    label: 'Producto',
    align: 'left',
    sortable: true,
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    align: 'left',
    sortable: true,
  },

] 