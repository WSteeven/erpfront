import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { RolPago } from './RolPago'

export const configuracionColumnasRolPago: ColumnConfig<RolPago>[] = [
    {
      name: 'empleado_info',
      field: 'empleado_info',
      label: 'Empleado',
      align: 'left',
      sortable: true
  },
  {
    name: 'salario',
    field: 'salario',
    label: 'Salario',
    align: 'left',
    sortable: true
},
{
  name: 'dias',
  field: 'dias',
  label: 'Días',
  align: 'left',
  sortable: true
},
{
  name: 'ingresos',
  field: 'ingresos',
  label: 'Ingresos',
  align: 'left',
  sortable: true
},
{
  name: 'total_egreso',
  field: 'total_egreso',
  label: 'Total Egreso',
  align: 'left',
  sortable: true
},
{
  name: 'total',
  field: 'total',
  label: 'Total',
  align: 'left',
  sortable: true
},

]
