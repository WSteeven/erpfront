import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { BonoVentas } from './BonoVenta'

export const configuracionColumnasBonoVenta: ColumnConfig<BonoVentas>[] = [
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
  label: 'Valor a  Comisionar',
  align: 'left',
  sortable: true
},

]
