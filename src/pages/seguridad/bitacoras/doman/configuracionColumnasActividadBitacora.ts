import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ActividadBitacora } from './ActividadBitacora'

export const configuracionColumnasActividadBitacora: ColumnConfig<ActividadBitacora>[] = [
  {
    name: 'hora_inicio',
    field: 'hora_inicio',
    label: 'Hora de inicio',
    align: 'left',
  },
  {
    name: 'hora_fin',
    field: 'hora_fin',
    label: 'Hora de fin',
    align: 'left',
  },
  {
    name: 'tipo_evento',
    field: 'tipo_evento',
    label: 'Tipo de evento',
    align: 'left',
  },
  {
    name: 'notificacion_inmediata',
    field: 'notificacion_inmediata',
    label: 'Notificación inmediata',
    align: 'left',
    editable: false,
  },
  {
    name: 'actividad',
    field: 'actividad',
    label: 'Actividad',
    align: 'left',
  },
  {
    name: 'ubicacion',
    field: 'ubicacion',
    label: 'Ubicación',
    align: 'left',
  },
  {
    name: 'tiene_adjuntos',
    field: 'tiene_adjuntos',
    label: 'Tiene adjuntos',
    align: 'left',
    type: 'boolean',
    editable: false,
  },
]
