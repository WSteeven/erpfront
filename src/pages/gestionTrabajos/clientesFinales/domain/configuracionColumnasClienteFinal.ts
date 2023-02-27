import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ClienteFinal } from './ClienteFinal'

export const configuracionColumnasClienteFinal: ColumnConfig<ClienteFinal>[] = [
  {
    name: 'id_cliente_final',
    field: 'id_cliente_final',
    label: 'ID Cliente',
    align: 'left',
  },
  {
    name: 'cliente',
    field: 'cliente',
    label: 'Cliente corporativo',
    align: 'left',
  },
  {
    name: 'nombres',
    field: 'nombres',
    label: 'Nombres',
    align: 'left',
  },
  {
    name: 'apellidos',
    field: 'apellidos',
    label: 'Apellidos',
    align: 'left',
  },
  {
    name: 'celular',
    field: 'celular',
    label: 'Celular',
    align: 'left',
  },
  {
    name: 'provincia',
    field: 'provincia',
    label: 'Provincia',
    align: 'left',
  },
  {
    name: 'canton',
    field: 'canton',
    label: 'Canton',
    align: 'left',
  },
]
