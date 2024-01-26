import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { EgresoRolPago } from './EgresoRolPago'

export const configuracionColumnasEgresoRolPago: ColumnConfig<EgresoRolPago>[] = [
{
  name: 'tipo',
  field: 'tipo',
  label: 'Tipo',
  align: 'left',
  sortable: true
},
{
  name: 'descuento',
  field: 'descuento',
  label: 'Descuento',
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
