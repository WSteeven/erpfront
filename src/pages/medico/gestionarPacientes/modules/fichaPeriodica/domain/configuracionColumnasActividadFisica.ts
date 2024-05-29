import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ActividadFisica } from './ActividadFisica'

export const configuracionColumnasActividadFisica: ColumnConfig<ActividadFisica>[] = [
  {
    name: 'nombre_actividad',
    field: 'nombre_actividad',
    label: 'Actividad física',
    align: 'left',
    sortable: true,
    editable: true,
  },
  {
    name: 'tiempo',
    field: 'tiempo',
    label: 'Tiempo(dia)',
    align: 'left',
    sortable: true,
    type: 'number',
    editable: true,
  },
]
