import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { MovilizacionSubtarea } from 'pages/gestionTrabajos/movilizacionSubtareas/domain/MovilizacionSubtarea'

export const configuracionColumnasMovilizacionSubtarea: ColumnConfig<MovilizacionSubtarea>[] = [
  {
    name: 'empleado',
    field: 'empleado',
    label: 'Empleado',
    align: 'left',
    sortable: true,
  },
  {
    name: 'grupo',
    field: 'grupo',
    label: 'Grupo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'motivo',
    field: 'motivo',
    label: 'Motivo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'subtarea',
    field: 'subtarea',
    label: 'Subtarea destino',
    align: 'left',
    sortable: true,
  },
  {
    name: 'fecha_hora_salida',
    field: 'fecha_hora_salida',
    label: 'Fecha hora salida',
    align: 'left',
    sortable: true,
  },
  {
    name: 'fecha_hora_llegada',
    field: 'fecha_hora_llegada',
    label: 'Fecha hora llegada',
    align: 'left',
    sortable: true,
  },
  {
    name: 'tiempo_transcurrido',
    field: 'tiempo_transcurrido',
    label: 'Tiempo transcurrido',
    align: 'left',
    sortable: true,
  },
  {
    name: 'latitud',
    field: 'latitud',
    label: 'Latitud',
    align: 'left',
  },
  {
    name: 'longitud',
    field: 'longitud',
    label: 'Longitud',
    align: 'left',
  },
  {
    name: 'estado_subtarea_llegada',
    field: 'estado_subtarea_llegada',
    label: 'Estado subtarea llegada',
    align: 'left',
  },
  {
    name: 'coordinador_registrante_llegada',
    field: 'coordinador_registrante_llegada',
    label: 'Coordinador registrante llegada',
    align: 'left',
    sortable: true,
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
    sortable: true,
  },
]
