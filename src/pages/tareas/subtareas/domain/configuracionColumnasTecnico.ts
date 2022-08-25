import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Tecnico } from './Tecnico'

export const configuracionColumnasTiposTareas: ColumnConfig<Tecnico>[] = [
  {
    name: 'nombres',
    field: 'nombres',
    label: 'Nombres',
    align: 'left',
    sortable: true,
  },
  {
    name: 'apellidos',
    field: 'apellidos',
    label: 'Apellidos',
    align: 'left',
    sortable: true,
  },
  {
    name: 'grupo',
    field: 'grupo',
    label: 'Grupo',
    align: 'left',
    sortable: true,
  },
]
