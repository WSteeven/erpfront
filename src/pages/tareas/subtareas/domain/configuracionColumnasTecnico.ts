import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { Tecnico } from './Tecnico'

export const configuracionColumnasTecnico: ColumnConfig<Empleado>[] = [
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
    name: 'telefono',
    field: 'telefono',
    label: 'Teléfono',
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
  {
    name: 'disponible',
    field: 'disponible',
    label: 'Disponible',
    align: 'left',
    sortable: true,
  },
]
