import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoTarea } from './TipoTarea'

export const configuracionColumnasTiposTareas: ColumnConfig<TipoTarea>[] = [
  {
    name: 'cliente',
    field: 'cliente',
    label: 'Cliente',
    align: 'left',
    sortable: true,
  },
  {
    name: 'categoria',
    field: 'categoria',
    label: 'Categoría',
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
