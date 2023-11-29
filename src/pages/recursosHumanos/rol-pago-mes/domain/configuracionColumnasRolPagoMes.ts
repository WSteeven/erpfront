import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { RolPagoMes } from './RolPagoMes'

export const configuracionColumnasRolPagoMes: ColumnConfig<RolPagoMes>[] = [

{
  name: 'mes',
  field: 'mes',
  label: 'Mes',
  align: 'left',
  sortable: true
},
{
  name: 'nombre',
  field: 'nombre',
  label: 'Nombre',
  align: 'left',
  sortable: true
},



]
