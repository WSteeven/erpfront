import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ReporteSubtareasRealizadas } from './ReporteSubtareasRealizadas'

export const configuracionColumnasSubtareasRealizadas: ColumnConfig<ReporteSubtareasRealizadas>[] = [
  {
    name: 'tipo_trabajo',
    field: 'tipo_trabajo',
    label: 'Tipo de trabajo',
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
