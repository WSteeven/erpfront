import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { BonoSupervisor } from './BonoSupervisor'

export const configuracionColumnasBonoSupervisor: ColumnConfig<BonoSupervisor>[] = [
{
  name: 'porcentaje',
  field: 'porcentaje',
  label: 'Porcentaje',
  align: 'left',
  sortable: true
},

{
  name: 'comision',
  field: 'comision',
  label: 'Valor a  Comisionar',
  align: 'left',
  sortable: true
},
{
  name: 'tipo_vendedor',
  field: 'tipo_vendedor',
  label: 'Tipo de Vendedor',
  align: 'left',
  sortable: true
},

]
