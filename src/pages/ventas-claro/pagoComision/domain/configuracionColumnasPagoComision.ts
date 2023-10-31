import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { PagoComision } from './PagoComision'

export const configuracionColumnasPagoComision: ColumnConfig<PagoComision>[] = [

{
  name: 'mes',
  field: 'mes',
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
  name: 'chargeback',
  field: 'chargeback',
  label: 'Chargeback',
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
