import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Descuento } from 'recursosHumanos/descuentos/domain/Descuento'

export const configuracionColumnasDescuentos: ColumnConfig<Descuento>[]=[
  {
    name: 'empleado',
    field: 'empleado',
    label: 'Empleado',
    align: 'left',
    sortable: true
  },
  {
    name: 'valor',
    field: 'valor',
    label: 'Monto',
    align: 'left',
    sortable: true
  },
  {
    name: 'cantidad_cuotas',
    field: 'cantidad_cuotas',
    label: 'Cant. Cuotas',
    align: 'left',
    sortable: true
  },
  {
    name: 'pendiente_pagar',
    field: 'pendiente_pagar',
    label: 'Pendiente Pagar',
    align: 'left',
    sortable: true
  },

]
