import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { UmbralVentas } from './UmbralVentas'

export const configuracionColumnasUmbralVentas: ColumnConfig<UmbralVentas>[] = [
{
  name: 'cantidad_ventas',
  field: 'cantidad_ventas',
  label: 'Cantidad de Ventas',
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
]
