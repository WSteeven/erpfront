import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ReporteSubtareasRealizadasPorRegion } from './ReporteSubtareasRealizadasPorRegion'

export const configuracionColumnasSubtareasRealizadasPorRegion: ColumnConfig<ReporteSubtareasRealizadasPorRegion>[] = [
  {
    name: 'region',
    field: 'region',
    label: 'Región',
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
