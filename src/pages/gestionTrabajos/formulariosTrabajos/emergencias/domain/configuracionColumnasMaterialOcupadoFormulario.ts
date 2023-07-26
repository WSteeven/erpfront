import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { MaterialOcupadoFormulario } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/MaterialOcupadoFormulario'

export const configuracionColumnasMaterialOcupadoFormulario: ColumnConfig<MaterialOcupadoFormulario>[] = [
  {
    name: 'detalle_producto',
    field: 'detalle_producto',
    label: 'Producto',
    align: 'left',
    sortable: true,
    type: 'text'
  },
  /* {
    name: 'medida',
    field: 'medida',
    label: 'Medida',
    align: 'left',
  }, */
  {
    name: 'despachado',
    field: 'despachado',
    label: 'Despachado',
    align: 'left',
  },
  {
    name: 'cantidad_utilizada',
    field: 'cantidad_utilizada',
    label: 'Cantidad utilizada hoy',
    align: 'left',
  },
  {
    name: 'stock_actual',
    field: 'stock_actual',
    label: 'Stock actual',
    align: 'left',
  },
  {
    name: 'total_cantidad_utilizada',
    field: 'total_cantidad_utilizada',
    label: 'Total cantidad utilizada',
    align: 'left',
  },
  {
    name: 'devuelto',
    field: 'devuelto',
    label: 'Devuelto',
    align: 'left',
  },
]
