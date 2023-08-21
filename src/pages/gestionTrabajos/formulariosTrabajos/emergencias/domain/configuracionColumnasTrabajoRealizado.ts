import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import ActividadRealizadaSeguimientoSubtarea from './ActividadRealizadaSeguimientoSubtarea'

export const configuracionColumnasTrabajoRealizado: ColumnConfig<ActividadRealizadaSeguimientoSubtarea>[] = [
  {
    name: 'fecha_hora',
    field: 'fecha_hora',
    label: 'Fecha hora',
    align: 'left',
    type: 'text',
    sortable: true,
    editable: false,
  },
  {
    name: 'trabajo_realizado',
    field: 'trabajo_realizado',
    label: 'Trabajo realizado',
    align: 'left',
    type: 'text',
    hint: 'Obligatorio',
    requerido: true,
  },
  {
    name: 'fotografia',
    field: 'fotografia',
    label: 'Fotografia',
    align: 'left',
    type: 'imagen',
    visible: false,
    hint: 'Obligatorio',
    requerido: true,
  },
]
