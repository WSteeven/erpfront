import ActividadRealizadaSeguimientoTicket from './ActividadRealizadaSeguimientoTicket'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasActividadRealizadaSeguimientoTicket: ColumnConfig<ActividadRealizadaSeguimientoTicket>[] = [
  {
    name: 'fecha_hora',
    field: 'fecha_hora',
    label: 'Fecha hora',
    align: 'center',
    type: 'text',
    sortable: true,
    editable: false,
  },
  {
    name: 'actividad_realizada',
    field: 'actividad_realizada',
    label: 'Actividad realizada',
    align: 'left',
    type: 'text',
    hint: 'Obligatorio',
    requerido: true,
  },
  {
    name: 'responsable',
    field: 'responsable',
    label: 'Responsable',
    align: 'center',
    editable: false,
  },
  {
    name: 'observacion',
    field: 'observacion',
    label: 'Observación',
    align: 'left',
    type: 'text',
    hint: 'Opcional',
  },
  {
    name: 'fotografia',
    field: 'fotografia',
    label: 'Fotografia',
    align: 'left',
    type: 'imagen',
    visible: false,
    hint: 'Opcional',
  },
]
