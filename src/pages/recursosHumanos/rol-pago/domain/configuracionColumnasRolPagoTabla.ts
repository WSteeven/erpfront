import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { RolPagoTabla } from './RolPagoTabla'

export const configuracionColumnasRolPagoTabla: ColumnConfig<RolPagoTabla>[] = [
    {
      name: 'empleado_info',
      field: 'empleado_info',
      label: 'Empleado',
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
  name: 'alimentacion',
  field: 'alimentacion',
  label: 'Alimentación',
  align: 'left',
  sortable: true
},
{
  name: 'horas_extras',
  field: 'horas_extras',
  label: 'Horas Extras',
  align: 'left',
  sortable: true
},
{
  name: 'comision',
  field: 'comision',
  label: 'Comisiones',
  align: 'left',
  sortable: true
},





]
