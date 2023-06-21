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
    name: 'solicitante_info',
    field: 'solicitante_info',
    label: 'Solicitante',
    align: 'left',
    sortable: true
},
  {
    name: 'monto',
    field: 'monto',
    label: 'Monto',
    align: 'left',
    sortable: true
},
{
  name: 'plazo',
  field: 'plazo',
  label: 'Plazo',
  align: 'left',
  sortable: true
},
]
