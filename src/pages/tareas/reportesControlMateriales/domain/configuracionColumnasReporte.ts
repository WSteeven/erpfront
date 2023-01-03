import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ReporteControlMaterial } from './ReporteControlMaterial'

export const configuracionColumnasControlAsistencia: ColumnConfig<ReporteControlMaterial>[] =
  [
    {
      name: 'item',
      field: 'item',
      label: 'Items',
      align: 'left',
      sortable: true,
    },
    {
      name: 'detalle_material',
      field: 'detalle_material',
      label: 'Detalle del material',
      align: 'left',
      sortable: true,
    },
    {
      name: 'stock_inicial',
      field: 'stock_inicial',
      label: 'Stock inicial',
      align: 'left',
      sortable: true,
    },
    {
      name: 'utilizado',
      field: 'utilizado',
      label: 'Utilizado',
      align: 'left',
      sortable: true,
    },
    {
      name: 'stock_final_dia',
      field: 'stock_final_dia',
      label: 'Stock final dia',
      align: 'left',
      sortable: true,
    },
  ]
