import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasSubtareasRealizadasPorGrupo: ColumnConfig<any>[] = [
  {
    name: 'grupo',
    field: 'grupo',
    label: 'Grupo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'suma_trabajo',
    field: 'suma_trabajo',
    label: 'Suma de trabajo',
    align: 'right',
    sortable: true,
  },
]
