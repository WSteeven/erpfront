import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Grupo } from 'pages/tareas/grupos/domain/Grupo'

export const configuracionColumnasGrupo: ColumnConfig<Grupo>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
  },
]
