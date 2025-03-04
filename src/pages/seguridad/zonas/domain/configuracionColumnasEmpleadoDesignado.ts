import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'

export const configuracionColumnasEmpleadoDesignado: ColumnConfig<Empleado>[] = [
  {
    name: 'apellidos',
    field: 'apellidos',
    label: 'Apellidos',
    align: 'left',
  },
  {
    name: 'nombres',
    field: 'nombres',
    label: 'Nombres',
    align: 'left',
  },
  {
    name: 'cargo',
    field: 'cargo',
    label: 'Cargo',
    align: 'left',
  },
]
