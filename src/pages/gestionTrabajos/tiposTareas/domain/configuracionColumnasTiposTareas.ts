import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoTrabajo } from './TipoTrabajo'

export const configuracionColumnasTiposTareas: ColumnConfig<TipoTrabajo>[] = [
  {
    name: 'cliente',
    field: 'cliente',
    label: 'Cliente corporativo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Nombre de trabajo',
    align: 'left',
    sortable: true,
  },
]
