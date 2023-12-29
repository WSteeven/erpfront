import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ClienteClaro } from './ClienteClaro'

export const configuracionColumnasClienteClaro: ColumnConfig<ClienteClaro>[] = [
{
  name: 'identificacion',
  field: 'identificacion',
  label: 'Identificacion',
  align: 'left',
  sortable: true
},
{
  name: 'nombres',
  field: 'nombres',
  label: 'Nombres',
  align: 'left',
  sortable: true
},
{
  name: 'apellidos',
  field: 'apellidos',
  label: 'Apellidos',
  align: 'left',
  sortable: true
},
]
