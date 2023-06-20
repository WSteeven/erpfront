import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { SolicitudPrestamo } from './SolicitudPrestamo'

export const configuracionColumnasSolicitudPrestamo: ColumnConfig<SolicitudPrestamo>[] = [
    {
      name: 'fecha',
      field: 'fecha',
      label: 'Fecha',
      align: 'left',
      sortable: true
  },
  {
    name: 'monto',
    field: 'monto',
    label: 'monto',
    align: 'left',
    sortable: true
},
{
  name: 'forma_pago_info',
  field: 'forma_pago_info',
  label: 'Forma de pago',
  align: 'left',
  sortable: true
},
]
