import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { LicenciaEmpleado } from './LicenciaEmpleado'

export const configuracionColumnasLicenciaEmpleado: ColumnConfig<LicenciaEmpleado>[] = [
    {
        name: 'justificacion',
        field: 'justificacion',
        label: 'Juatificacion',
        align: 'left',
        sortable: true
    },
    {
      name: 'estado_licencia_info',
      field: 'estado_licencia_info',
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
