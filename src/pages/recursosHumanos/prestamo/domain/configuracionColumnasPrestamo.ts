import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Prestamo } from './Prestamo'

export const configuracionColumnasPrestamo: ColumnConfig<Prestamo>[] = [
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
    label: 'monto',
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
