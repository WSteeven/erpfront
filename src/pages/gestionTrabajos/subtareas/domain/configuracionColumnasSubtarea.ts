import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { useAuthenticationStore } from 'stores/authentication'
import { estadosTrabajoArray } from 'config/utils'
import { Subtarea } from './Subtarea'

const authenticationStore = useAuthenticationStore()

export const configuracionColumnasSubtarea: ColumnConfig<Subtarea>[] = [
  {
    name: 'codigo_tarea',
    field: 'codigo_tarea',
    label: 'Tarea JP',
    align: 'left',
    sortable: true,
  },
  {
    name: 'codigo_subtarea',
    field: 'codigo_subtarea',
    label: 'Código de subtarea',
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
    name: 'coordinador',
    field: 'coordinador',
    label: 'Coordinador',
    align: 'left',
    filtrar: authenticationStore.esJefeTecnico || authenticationStore.esCoordinadorBackup,
  },
  {
    name: 'titulo',
    field: 'titulo',
    label: 'Título del trabajo',
    align: 'left',
  },
  {
    name: 'tipo_trabajo',
    field: 'tipo_trabajo',
    label: 'Tipo de trabajo',
    align: 'left',
  },
  {
    name: 'cantidad_adjuntos',
    field: 'cantidad_adjuntos',
    label: 'Cant. Adjuntos',
    align: 'left',
    type: 'number',
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
    type: 'datetime',
  },
  {
    name: 'fecha_inicio_trabajo',
    field: 'fecha_inicio_trabajo',
    label: 'Fecha de inicio de trabajo',
    align: 'left',
    type: 'date',
  },
  {
    name: 'hora_inicio_trabajo',
    field: 'hora_inicio_trabajo',
    label: 'Hora inicio de trabajo',
    align: 'left',
  },
  {
    name: 'hora_fin_trabajo',
    field: 'hora_fin_trabajo',
    label: 'Hora fin de trabajo',
    align: 'left',
  },
  {
    name: 'fecha_hora_asignacion',
    field: 'fecha_hora_asignacion',
    label: 'Fecha y hora de asignación',
    align: 'left',
    type: 'date'
  },
  {
    name: 'fecha_hora_agendado',
    field: 'fecha_hora_agendado',
    label: 'Fecha y hora de agendado',
    align: 'left',
    type: 'date'
  },
  {
    name: 'fecha_hora_ejecucion',
    field: 'fecha_hora_ejecucion',
    label: 'Fecha y hora de ejecución',
    align: 'left',
    type: 'datetime',
  },
  {
    name: 'fecha_hora_realizado',
    field: 'fecha_hora_realizado',
    label: 'Fecha y hora de realizado',
    align: 'left',
    type: 'date'
  },
  {
    name: 'fecha_hora_finalizacion',
    field: 'fecha_hora_finalizacion',
    label: 'Fecha y hora de finalización',
    align: 'left',
    type: 'date'
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
    type: 'date',
  },
  {
    name: 'motivo_suspendido',
    field: 'motivo_suspendido',
    label: 'Motivo de suspención',
    align: 'left',
  },
  {
    name: 'fecha_hora_cancelado',
    field: 'fecha_hora_cancelado',
    label: 'Fecha y hora de cancelación',
    align: 'left',
    type: 'date',
  },
  {
    name: 'motivo_cancelado',
    field: 'motivo_cancelado',
    label: 'Motivo de cancelación',
    align: 'left',
  },
  {
    name: 'empleado_responsable',
    field: 'empleado_responsable',
    label: 'Empleado responsable',
    align: 'left',
  },
  {
    name: 'grupo',
    field: 'grupo',
    label: 'Grupo designado',
    align: 'left',
  },
  {
    name: 'subtarea_dependiente',
    field: 'subtarea_dependiente',
    label: 'Depende de',
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
