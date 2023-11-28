import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { PermisoEmpleado } from './PermisoEmpleado'

export const configuracionColumnasPermisoEmpleado: ColumnConfig<PermisoEmpleado>[] = [
    {
        name: 'justificacion',
        field: 'justificacion',
        label: 'Juatificacion',
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
    name: 'fecha_hora_inicio',
    field: 'fecha_hora_inicio',
    label: 'Inicio',
    align: 'left',
    sortable: true
},
{
  name: 'fecha_hora_fin',
  field: 'fecha_hora_fin',
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
{
  name: 'observacion',
  field: 'observacion',
  label: 'Sugerencias',
  align: 'left',
  sortable: true
},
{
  name: 'fecha_hora_reagendamiento',
  field: 'fecha_hora_reagendamiento',
  label: 'Fcha Sugerida de Permiso',
  align: 'left',
  sortable: true
}

]
