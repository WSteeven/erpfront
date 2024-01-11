import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { BonoMensualCumplimiento } from './BonoMensualCumplimiento'

export const configuracionColumnasBonoMensualCumplimiento: ColumnConfig<BonoMensualCumplimiento>[] = [

{
  name: 'vendedor_info',
  field: 'vendedor_info',
  label: 'Vendedor',
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
  name: 'cant_ventas',
  field: 'cant_ventas',
  label: 'Cantidad de Ventas',
  align: 'left',
  sortable: true
},

{
  name: 'valor',
  field: 'valor',
  label: 'Bono',
  align: 'left',
  sortable: true
},

]
