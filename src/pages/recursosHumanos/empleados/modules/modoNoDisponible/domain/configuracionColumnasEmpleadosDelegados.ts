import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import {
  EmpleadoDelegado
} from 'recursosHumanos/empleados/modules/modoNoDisponible/domain/EmpleadoDelegado'

export const configuracionColumnasEmpleadosDelegados: ColumnConfig<EmpleadoDelegado>[]=[
  {
    name: 'empleado',
    field: 'empleado',
    label: 'Delegador',
    align: 'left',
    sortable: true,
  },
  {
    name: 'delegado',
    field: 'delegado',
    label: 'Delegado',
    align: 'left',
    sortable: true,
  },
  {
    name: 'fecha_hasta',
    field: 'fecha_hasta',
    label: 'F. Hasta',
    align: 'left',
    sortable: true,
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Estado',
    align: 'left',
    sortable: true,
  },
]
