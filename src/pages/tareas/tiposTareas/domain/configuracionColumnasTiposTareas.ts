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
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre de tarea',
    align: 'left',
    sortable: true,
  },
]
