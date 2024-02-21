import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ClienteClaro } from './ClienteClaro'

export const configuracionColumnasClienteClaro: ColumnConfig<ClienteClaro>[] = [
  {
    name: 'identificacion',
    field: 'identificacion',
    label: 'Identificación',
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
  {
    name: 'direccion',
    field: 'direccion',
    label: 'Dirección',
    align: 'left',
  },
  {
    name: 'telefono1',
    field: 'telefono1',
    label: 'Teléfono',
    align: 'left',
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Estado',
    align: 'left',
    sortable: true
  },
]
