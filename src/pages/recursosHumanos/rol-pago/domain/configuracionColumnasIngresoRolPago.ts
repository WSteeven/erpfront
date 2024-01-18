import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { IngresoRolPago } from './IngresoRolPago'

export const configuracionColumnasIngresoRolPago: ColumnConfig<IngresoRolPago>[] = [

{
  name: 'concepto_info',
  field: 'concepto_info',
  label: 'Ingreso',
  align: 'left',
  sortable: true
},
{
  name: 'monto',
  field: 'monto',
  label: 'Monto',
  align: 'left',
  sortable: true
},
]
