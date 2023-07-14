import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { PrestamoHipotecario } from './PrestamoHipotecario'

export const configuracionColumnasPrestamoHipotecario: ColumnConfig<PrestamoHipotecario>[] = [

{
  name: 'empleado_info',
  field: 'empleado_info',
  label: 'Empleado',
  align: 'left',
  sortable: true
},
{
  name: 'mes',
  field: 'mes',
  label: 'Mes',
  align: 'left',
  sortable: true
},
{
  name: 'nut',
  field: 'nut',
  label: 'NUT',
  align: 'left',
  sortable: true
},
{
  name: 'valor',
  field: 'valor',
  label: 'Valor',
  align: 'left',
  sortable: true
},

]
