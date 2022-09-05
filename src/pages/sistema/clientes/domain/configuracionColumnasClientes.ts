import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Cliente } from './Cliente'

export const configuracionColumnasClientes: ColumnConfig<Cliente>[] = [
  {
    name: 'razon_social',
    field: 'razon_social',
    label: 'Cliente',
    align: 'left',
    sortable: true,
  },
  {
    name: 'parroquia',
    field: 'parroquia',
    label: 'Parroquia',
    align: 'left',
    sortable: true,
  },
  {
    name: 'requiere_bodega',
    field: 'requiere_bodega',
    label: 'Requiere bodega',
    align: 'left',
    sortable: true,
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
    sortable: true,
  },
]
