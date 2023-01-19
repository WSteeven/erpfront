import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { MaterialOcupado } from 'pages/tareas/tendidos/controlTendidos/modules/registrosTendidos/domain/MaterialOcupado'

export const configuracionColumnasMaterial: ColumnConfig<MaterialOcupado>[] = [
  {
    name: 'detalle',
    field: 'detalle',
    label: 'Producto',
    align: 'left',
    sortable: true,
    input_type: 'text'
  },
  {
    name: 'medida',
    field: 'medida',
    label: 'Medida',
    align: 'left',
  },
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
