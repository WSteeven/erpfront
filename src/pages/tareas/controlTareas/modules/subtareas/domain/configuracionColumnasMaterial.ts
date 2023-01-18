import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { MaterialOcupado } from 'pages/tareas/tendidos/controlTendidos/modules/registrosTendidos/domain/MaterialOcupado'

export const configuracionColumnasMaterial: ColumnConfig<MaterialOcupado>[] = [
  {
    name: 'cantidad_utilizada',
    field: 'cantidad_utilizada',
    label: 'Cantidad utilizada',
    align: 'left',
    input_type: 'number'
  },
  {
    name: 'medida',
    field: 'medida',
    label: 'Medida',
    align: 'left',
    sortable: true,
    input_type: 'text'
  },
  {
    name: 'detalle',
    field: 'detalle',
    label: 'Producto',
    align: 'left',
    sortable: true,
    input_type: 'text'
  },
]
