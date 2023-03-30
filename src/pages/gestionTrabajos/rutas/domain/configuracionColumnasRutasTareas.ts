import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { RutaTarea } from './RutaTarea'

export const configuracionColumnasRutasTareas: ColumnConfig<RutaTarea>[] = [
  {
    name: 'cliente',
    field: 'cliente',
    label: 'Cliente corporativo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'ruta',
    field: 'ruta',
    label: 'Ruta',
    align: 'left',
    sortable: true,
  },
]
