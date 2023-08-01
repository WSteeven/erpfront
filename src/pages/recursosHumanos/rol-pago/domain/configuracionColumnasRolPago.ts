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
  name: 'sueldo',
  field: 'sueldo',
  label: 'Sueldo',
  align: 'left',
  sortable: true
},
{
  name: 'dias',
  field: 'dias',
  label: 'Días Laborados',
  align: 'left',
  sortable: true
},
{
  name: 'bonificacion',
  field: 'bonificacion',
  label: 'Bonificación',
  align: 'left',
  sortable: true
},
{
  name: 'bono_recurente',
  field: 'bono_recurente',
  label: 'Bono Recurente',
  align: 'left',
  sortable: true
},
{
  name: 'decimo_tercero',
  field: 'decimo_tercero',
  label: 'Decimo Tercero',
  align: 'left',
  sortable: true
},
{
  name: 'decimo_cuarto',
  field: 'decimo_cuarto',
  label: 'Decimo Cuarto',
  align: 'left',
  sortable: true
},
{
  name: 'concepto_ingreso_info',
  field: 'concepto_ingreso_info',
  label: 'Concepto',
  align: 'left',
  sortable: true
},
{
  name: 'total_ingreso',
  field: 'total_ingreso',
  label: 'Total Ingreso',
  align: 'left',
  sortable: true
},
{
  name: 'descuento_ley_info',
  field: 'descuento_ley_info',
  label: 'Descuentos de ley',
  align: 'left',
  sortable: true
},
{
  name: 'descuento_general_info',
  field: 'descuento_general_info',
  label: 'Descuentos Generales',
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
