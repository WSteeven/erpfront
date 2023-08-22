import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { MaterialEmpleadoTarea } from './MaterialEmpleadoTarea'

export const configuracionColumnasMaterialEmpleadoTarea: ColumnConfig<MaterialEmpleadoTarea>[] =
  [
    {
      name: 'id',
      field: 'id',
      label: 'N°',
      align: 'left',
      sortable: true,
    },
    {
      name: 'detalle_producto',
      field: 'detalle_producto',
      label: 'Detalle del producto',
      align: 'left',
      sortable: true,
    },
    {
      name: 'serial',
      field: 'serial',
      label: 'Serial',
      align: 'left',
      sortable: true,
    },
    {
      name: 'medida',
      field: 'medida',
      label: 'Medida',
      align: 'left',
      sortable: true,
    },
    {
      name: 'stock_actual',
      field: 'stock_actual',
      label: 'Stock actual',
      align: 'left',
      sortable: true,
    },
  ]
