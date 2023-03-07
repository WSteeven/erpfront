import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'

export const configuracionColumnasEmpleadoGrupo: ColumnConfig<Empleado>[] = [
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
  {
    name: 'cargo',
    field: 'cargo',
    label: 'Cargo',
    align: 'left',
    sortable: true,
  },
]
