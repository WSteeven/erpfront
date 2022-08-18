import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { MaterialesSolicitados } from './MaterialesSolicitados'

export const configuracionColumnasMaterialesSolicitados: ColumnConfig<MaterialesSolicitados>[] =
  [
    {
      name: 'codigo_producto',
      field: 'codigo_producto',
      label: 'Código de producto',
      align: 'left',
      sortable: true,
    },
    {
      name: 'nombre_producto',
      field: 'nombre_producto',
      label: 'Nombre de producto',
      align: 'left',
      sortable: true,
    },
    {
      name: 'cantidad_solicitada',
      field: 'cantidad_solicitada',
      label: 'Cantidad solicitada',
      align: 'left',
      sortable: true,
    },
    {
      name: 'cantidad_despachada',
      field: 'cantidad_despachada',
      label: 'Cantidad despachada',
      align: 'left',
      sortable: true,
    },
  ]
