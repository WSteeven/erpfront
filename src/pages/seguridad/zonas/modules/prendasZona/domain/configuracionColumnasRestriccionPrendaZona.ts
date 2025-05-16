import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { RestriccionPrendaZona } from './RestriccionPrendaZona'

export const configuracionColumnasRestriccionPrendaZona: ColumnConfig<RestriccionPrendaZona>[] = [
  {
    name: 'detalle_producto',
    field: 'detalle_producto',
    label: 'Prenda',
    align: 'left',
    sortable: true
  },

]
