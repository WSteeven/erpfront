import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { BonoTrimestralCumplimiento } from './BonoTrimestralCumplimiento'

export const configuracionColumnasBonoTrimestralCumplimiento: ColumnConfig<BonoTrimestralCumplimiento>[] = [

{
  name: 'trimestre',
  field: 'trimestre',
  label: 'Mes',
  align: 'left',
  sortable: true
},
{
  name: 'vendedor_info',
  field: 'vendedor_info',
  label: 'Vendedor',
  align: 'left',
  sortable: true
},

{
  name: 'valor',
  field: 'valor',
  label: 'Comision',
  align: 'left',
  sortable: true
},



]
