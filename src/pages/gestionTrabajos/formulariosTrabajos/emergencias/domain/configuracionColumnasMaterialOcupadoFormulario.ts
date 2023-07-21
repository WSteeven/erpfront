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
    name: 'stock_actual',
    field: 'stock_actual',
    label: 'Stock actual',
    align: 'left',
  },
  {
    name: 'cantidad_utilizada',
    field: 'cantidad_utilizada',
    label: 'Cantidad utilizada',
    align: 'left',
  },
]
