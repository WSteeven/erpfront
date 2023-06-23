import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Vacacion } from './Vacacion'

export const configuracionColumnasVacacion: ColumnConfig<Vacacion>[] = [
    {
      name: 'empleado_info',
      field: 'empleado_info',
      label: 'Empleado',
      align: 'left',
      sortable: true
  },
  {
    name: 'periodo_info',
    field: 'periodo_info',
    label: 'Periodo',
    align: 'left',
    sortable: true
},
{
  name: 'descuento_vacaciones',
  field: 'descuento_vacaciones',
  label: 'Descuento a Vacaciones',
  align: 'left',
  sortable: true
},
{
  name: 'fecha_inicio_rango1_vacaciones',
  field: 'fecha_inicio_rango1_vacaciones',
  label: 'Fecha Inicio Rango 1 de Vacaciones',
  align: 'left',
  sortable: true
},
{
  name: 'fecha_fin_rango1_vacaciones',
  field: 'fecha_fin_rango1_vacaciones',
  label: 'Fecha Fin Rango 1 de Vacaciones',
  align: 'left',
  sortable: true
},
{
  name: 'fecha_inicio_rango2_vacaciones',
  field: 'fecha_inicio_rango2_vacaciones',
  label: 'Fecha Fin Rango 2 de Vacaciones',
  align: 'left',
  sortable: true
},
{
  name: 'fecha_fin_rango2_vacaciones',
  field: 'fecha_fin_rango2_vacaciones',
  label: 'Fecha Fin Rango 2 de Vacaciones',
  align: 'left',
  sortable: true
},
{
  name: 'solicitud',
  field: 'solicitud',
  label: 'Solicitud',
  align: 'left',
  sortable: true
},
]
