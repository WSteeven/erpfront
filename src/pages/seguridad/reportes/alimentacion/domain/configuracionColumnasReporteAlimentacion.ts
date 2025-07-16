import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ReporteAlimentacion } from './ReporteAlimentacion'

export const configuracionColumnasReporteAlimentacion: ColumnConfig<ReporteAlimentacion>[] = [
  {
    name: 'guardia',
    field: 'guardia',
    label: 'Guardia',
    align: 'left',
  },
  {
    name: 'fecha',
    field: 'fecha',
    label: 'Fecha',
    align: 'left',
  },
  {
    name: 'jornada',
    field: 'jornada',
    label: 'Jornada',
    align: 'left',
  },
  {
    name: 'alimentacion',
    field: 'alimentacion',
    label: 'Alimentación',
    align: 'right',
  },
]
