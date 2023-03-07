import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Subtarea } from 'gestionTrabajos/subtareas/domain/Subtarea'
import { estadosTrabajoArray } from 'config/utils'

export const configuracionColumnasTarea: ColumnConfig<Subtarea>[] = [
  {
    name: 'codigo_tarea_cliente',
    field: 'codigo_tarea_cliente',
    label: 'Tarea Cliente',
    align: 'left',
    sortable: true,
  },
  {
    name: 'codigo_tarea',
    field: 'codigo_tarea',
    label: 'Tarea JP',
    align: 'left',
    sortable: true,
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
    type: 'select',
    options: estadosTrabajoArray
  },
  {
    name: 'titulo',
    field: 'titulo',
    label: 'Título de la tarea',
    align: 'left',
  },
  {
    name: 'tipo_trabajo',
    field: 'tipo_trabajo',
    label: 'Tipo de trabajo',
    align: 'left',
  },
  {
    name: 'cantidad_subtareas',
    field: 'cantidad_subtareas',
    label: 'Cantidad de subtareas',
    align: 'left',
    sortable: true,
  },
  {
    name: 'fecha_solicitud',
    field: 'fecha_solicitud',
    label: 'Fecha solicitud',
    align: 'left',
    type: 'date',
  },
  {
    name: 'es_ventana',
    field: 'es_ventana',
    label: 'Es ventana',
    align: 'left',
    type: 'boolean',
  },
  {
    name: 'fecha_hora_creacion',
    field: 'fecha_hora_creacion',
    label: 'Fecha y hora de creación',
    align: 'left',
  },
  {
    name: 'fecha_agendado',
    field: 'fecha_agendado',
    label: 'Fecha de agendamiento',
    align: 'left',
    type: 'date',
  },
  {
    name: 'hora_inicio_agendado',
    field: 'hora_inicio_agendado',
    label: 'Hora inicio de agendamiento',
    align: 'left',
  },
  {
    name: 'hora_fin_agendado',
    field: 'hora_fin_agendado',
    label: 'Hora fin de agendamiento',
    align: 'left',
  },
  {
    name: 'fecha_hora_asignacion',
    field: 'fecha_hora_asignacion',
    label: 'Fecha y hora de asignación',
    align: 'left',
  },
  {
    name: 'fecha_hora_ejecucion',
    field: 'fecha_hora_ejecucion',
    label: 'Fecha y hora de ejecución',
    align: 'left',
  },
  {
    name: 'fecha_hora_realizado',
    field: 'fecha_hora_realizado',
    label: 'Fecha y hora de realizado',
    align: 'left',
  },
  {
    name: 'fecha_hora_finalizacion',
    field: 'fecha_hora_finalizacion',
    label: 'Fecha y hora de finalización',
    align: 'left',
  },
  {
    name: 'dias_ocupados',
    field: 'dias_ocupados',
    label: 'Días ocupados',
    align: 'left',
    type: 'number',
  },
  {
    name: 'fecha_hora_suspendido',
    field: 'fecha_hora_suspendido',
    label: 'Fecha y hora de suspención',
    align: 'left',
  },
  {
    name: 'causa_suspencion',
    field: 'causa_suspencion',
    label: 'Causa de suspención',
    align: 'left',
  },
  {
    name: 'fecha_hora_cancelacion',
    field: 'fecha_hora_cancelacion',
    label: 'Fecha y hora de cancelación',
    align: 'left',
  },
  {
    name: 'causa_cancelacion',
    field: 'causa_cancelacion',
    label: 'Causa de cancelación',
    align: 'left',
  },
  {
    name: 'empleado',
    field: 'empleado',
    label: 'Empleado designado',
    align: 'left',
  },
  {
    name: 'grupo',
    field: 'grupo',
    label: 'Grupo designado',
    align: 'left',
  },
  {
    name: 'coordinador',
    field: 'coordinador',
    label: 'Coordinador',
    align: 'left',
  },
  {
    name: 'canton',
    field: 'canton',
    label: 'Cantón',
    align: 'left',
  },
  {
    name: 'cliente',
    field: 'cliente',
    label: 'Cliente',
    align: 'left',
    sortable: true,
  },
  {
    name: 'proyecto',
    field: 'proyecto',
    label: 'Proyecto',
    align: 'left',
    sortable: true,
  },
]

/* import { ColumnConfig } from 'src/components/tables/domain/ColumnConfig'
import { Tarea } from '../domain/Tarea'

export const configuracionColumnasTareas: ColumnConfig<Tarea>[] = [
  {
    name: 'codigo_tarea',
    field: 'codigo_tarea',
    label: 'Código tarea',
    align: 'center',
    sortable: true,
  },
  {
    name: 'codigo_tarea_cliente',
    field: 'codigo_tarea_cliente',
    label: 'Código tarea Cliente',
    align: 'center',
    sortable: true,
  },
  {
    name: 'titulo',
    field: 'titulo',
    label: 'Título',
    align: 'left',
  },
  {
    name: 'proyecto',
    field: 'proyecto',
    label: 'Proyecto',
    align: 'center',
    sortable: true,
  },
  {
    name: 'cliente_final',
    field: 'cliente_final',
    label: 'Cliente final',
    sortable: true,
  },
  {
    name: 'coordinador',
    field: 'coordinador',
    label: 'Coordinador',
    align: 'center',
    sortable: true,
  },
  {
    name: 'fiscalizador',
    field: 'fiscalizador',
    label: 'Fiscalizador',
    align: 'center',
    sortable: true,
  },
  {
    name: 'cliente',
    field: 'cliente',
    label: 'Cliente',
    align: 'left',
    sortable: true,
  },
  {
    name: 'medio_notificacion',
    field: 'medio_notificacion',
    label: 'Medio de notificación',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cantidad_trabajos',
    field: 'cantidad_trabajos',
    label: 'Cantidad de subtareas',
    align: 'center',
    sortable: true,
  },
]*/
