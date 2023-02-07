import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { Tecnico } from './Tecnico'

export const configuracionColumnasEmpleado: ColumnConfig<Empleado>[] = [
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
    name: 'grupo_id',
    field: 'grupo_id',
    label: 'Grupo ID',
    align: 'left',
    sortable: true,
    visible: false,
  },
  /* {
    name: 'disponible',
    field: 'disponible',
    label: 'Disponible',
    align: 'left',
    sortable: true, */
  /* input_type: 'select',
  options: [
    {
      label: 'AMARRAS',
      value: '1'
    },
    {
      label: 'PREFORMADOS',
      value: '2'
    },
  ] */
  // },
  {
    name: 'roles',
    field: 'roles',
    label: 'Rol',
    align: 'left',
    sortable: true,
  },
]
