import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ProductoSeleccionadoSolicitudDescuento } from './ProductoSeleccionadoSolicitudDescuento'

export const configuracionColumnasProductosSeleccionadosSolicitudDescuento: ColumnConfig<ProductoSeleccionadoSolicitudDescuento>[] = [
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
  {
    name: 'cantidad',
    field: 'cantidad',
    label: 'Cantidad',
    align: 'left',
    type: 'number',
    editable: true,
    sortable: false,

  },
  {
    name: 'precio_unitario',
    field: 'precio_unitario',
    label: 'Precio unitario',
    align: 'left',
    type: 'number',
    editable: true,
    sortable: false,
  },
]

