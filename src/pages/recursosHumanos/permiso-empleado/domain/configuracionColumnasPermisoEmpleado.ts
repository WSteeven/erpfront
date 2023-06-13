import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { PermisoEmpleado } from './PermisoEmpleado'

export const configuracionColumnasPermisoEmpleado: ColumnConfig<PermisoEmpleado>[] = [
    {
        name: 'motivo_info',
        field: 'motivo_info',
        label: 'Motivo',
        align: 'left',
        sortable: true
    },
    {
      name: 'estado_permiso_info',
      field: 'estado_permiso_info',
      label: 'Estado',
      align: 'left',
      sortable: true
  },
  {
    name: 'fecha_inicio',
    field: 'fecha_inicio',
    label: 'Inicio',
    align: 'left',
    sortable: true
},
{
  name: 'fecha_fin',
  field: 'fecha_fin',
  label: 'Fin',
  align: 'left',
  sortable: true
},
{
  name: 'empleado_info',
  field: 'empleado_info',
  label: 'Empleado',
  align: 'left',
  sortable: true
},
]
