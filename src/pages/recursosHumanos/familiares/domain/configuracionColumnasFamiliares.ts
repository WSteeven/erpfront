import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Familiares } from './Familiares'

export const configuracionColumnasFamiliares: ColumnConfig<Familiares>[] = [
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
    name: 'fecha_nacimiento',
    field: 'fecha_nacimiento',
    label: 'Fecha Nacimiento',
    align: 'left',
    sortable: true,
    type: 'date'
  },
  {
    name: 'parentezco',
    field: 'parentezco',
    label: 'Parentezco',
    align: 'left',
    sortable: true
  },

  {
    name: 'empleado_info',
    field: 'empleado_info',
    label: 'Empleado',
    align: 'left',
    sortable: true
  }
]
