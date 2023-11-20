import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { PagoComision } from './PagoComision'

export const configuracionColumnasPagoComision: ColumnConfig<PagoComision>[] = [

{
  name: 'fecha',
  field: 'fecha',
  label: 'Fecha de corte',
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
