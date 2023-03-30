import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Subtarea } from 'gestionTrabajos/subtareas/domain/Subtarea'
import { estadosTrabajoArray } from 'config/utils'
import { Tarea } from './Tarea'

export const configuracionColumnasTarea: ColumnConfig<Tarea>[] = [
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
    name: 'finalizado',
    field: 'finalizado',
    label: 'Finalizado',
    align: 'left',
    sortable: true,
  },
  // {
  //   name: 'estado',
  //   field: 'estado',
  //   label: 'Estado',
  //   align: 'left',
  //   type: 'select',
  //   options: estadosTrabajoArray
  // },
  {
    name: 'titulo',
    field: 'titulo',
    label: 'Título de la tarea',
    align: 'left',
  },
  // {
  //   name: 'tipo_trabajo',
  //   field: 'tipo_trabajo',
  //   label: 'Tipo de trabajo',
  //   align: 'left',
  // },
  // {
  //   name: 'tiene_subtareas',til
  //   field: 'tiene_subtareas',
  //   label: 'Tiene de subtareas',
  //   align: 'left',
  //   sortable: true,
  // },
  {
    name: 'cantidad_subtareas',
    field: 'cantidad_subtareas',
    label: 'Cantidad de subtareas',
    align: 'left',
    sortable: true,
  },
  // {
  //   name: 'fecha_solicitud',
  //   field: 'fecha_solicitud',
  //   label: 'Fecha solicitud',
  //   align: 'left',
  //   type: 'date',
  // },
  // {
  //   name: 'es_ventana',
  //   field: 'es_ventana',
  //   label: 'Es ventana',
  //   align: 'left',
  //   type: 'boolean',
  // },
  // {
  //   name: 'fecha_hora_creacion',
  //   field: 'fecha_hora_creacion',
  //   label: 'Fecha y hora de creación',
  //   align: 'left',
  // },
  // {
  //   name: 'fecha_inicio_trabajo',
  //   field: 'fecha_inicio_trabajo',
  //   label: 'Fecha de inicio de trabajo',
  //   align: 'left',
  //   type: 'date',
  // },
  // {
  //   name: 'hora_inicio_trabajo',
  //   field: 'hora_inicio_trabajo',
  //   label: 'Hora inicio de trabajo',
  //   align: 'left',
  // },
  // {
  //   name: 'hora_fin_trabajo',
  //   field: 'hora_fin_trabajo',
  //   label: 'Hora fin de trabajo',
  //   align: 'left',
  // },
  // {
  //   name: 'fecha_hora_asignacion',
  //   field: 'fecha_hora_asignacion',
  //   label: 'Fecha y hora de asignación',
  //   align: 'left',
  // },
  // {
  //   name: 'fecha_hora_agendado',
  //   field: 'fecha_hora_agendado',
  //   label: 'Fecha y hora de agendado',
  //   align: 'left',
  // },
  // {
  //   name: 'fecha_hora_ejecucion',
  //   field: 'fecha_hora_ejecucion',
  //   label: 'Fecha y hora de ejecución',
  //   align: 'left',
  // },
  // {
  //   name: 'fecha_hora_realizado',
  //   field: 'fecha_hora_realizado',
  //   label: 'Fecha y hora de realizado',
  //   align: 'left',
  // },
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
  // {
  //   name: 'fecha_hora_suspendido',
  //   field: 'fecha_hora_suspendido',
  //   label: 'Fecha y hora de suspención',
  //   align: 'left',
  // },
  // {
  //   name: 'motivo_suspendido',
  //   field: 'motivo_suspendido',
  //   label: 'Motivo de suspención',
  //   align: 'left',
  // },
  // {
  //   name: 'fecha_hora_cancelado',
  //   field: 'fecha_hora_cancelado',
  //   label: 'Fecha y hora de cancelación',
  //   align: 'left',
  // },
  // {
  //   name: 'motivo_cancelado',
  //   field: 'motivo_cancelado',
  //   label: 'Motivo de cancelación',
  //   align: 'left',
  // },
  // {
  //   name: 'empleado',
  //   field: 'empleado',
  //   label: 'Empleado designado',
  //   align: 'left',
  // },
  // {
  //   name: 'grupo',
  //   field: 'grupo',
  //   label: 'Grupo designado',
  //   align: 'left',
  // },
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
  {
    name: 'ruta_tarea',
    field: 'ruta_tarea',
    label: 'Ruta',
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
