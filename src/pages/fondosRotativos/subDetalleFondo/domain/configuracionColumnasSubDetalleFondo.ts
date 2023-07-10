import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { SubDetalleFondo } from './SubDetalleFondo'

export const configuracionColumnasSubDetalleFondo: ColumnConfig<SubDetalleFondo>[] =
  [
    {
      name: 'detalle_viatico_info',
      field: 'detalle_viatico_info',
      label: 'Detalle',
      align: 'left',
      sortable: true,
    },
    {
      name: 'descripcion',
      field: 'descripcion',
      label: 'Sub Detalle',
      align: 'left',
      sortable: true,
    },
    {
      name: 'autorizacion',
      field: 'autorizacion',
      label: 'Autorizacion',
      align: 'left',
      sortable: true,
    },
    {
      name: 'tiene_factura',
      field: 'tiene_factura',
      label: 'Requiere Factura',
      align: 'left',
      sortable: true,
    },
  ]
