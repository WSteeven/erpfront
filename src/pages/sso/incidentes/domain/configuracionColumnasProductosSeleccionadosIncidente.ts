import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ProductoSeleccionadoIncidente } from './ProductoSeleccionadoIncidente'

export const configuracionColumnasProductosSeleccionadosIncidente: ColumnConfig<ProductoSeleccionadoIncidente>[] = [
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
    name: 'motivo_cambio',
    field: 'motivo_cambio',
    label: 'Motivo de cambio',
    align: 'left',
    editable: true,
    sortable: false,
  },
]

