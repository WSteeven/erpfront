import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Familiares } from './Familiares'

export const configuracionColumnasFamiliaresEmpleado: ColumnConfig<Familiares>[] =
  [
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
      name: 'parentezco',
      field: 'parentezco',
      label: 'Parentezco',
      align: 'left',
      sortable: true,
    },
  ]
