import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Subtarea } from 'gestionTrabajos/subtareas/domain/Subtarea'

export const configuracionColumnasTrabajoAsignado: ColumnConfig<Subtarea>[] = [
  {
    name: 'tarea',
    field: 'tarea',
    label: 'Cód. Tarea',
    align: 'left',
    sortable: true,
  },
  {
    name: 'codigo_subtarea',
    field: 'codigo_subtarea',
    label: 'Cód. Subtarea',
    align: 'left',
    sortable: true,
  },
  {
    name: 'titulo',
    field: 'titulo',
    label: 'Título',
    align: 'left',
    sortable: true,
  },
  {
    name: 'tipo_trabajo',
    field: 'tipo_trabajo',
    label: 'Tipo de trabajo',
    align: 'left',
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
    sortable: true,
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
    name: 'fecha_hora_asignacion',
    field: 'fecha_hora_asignacion',
    label: 'Fecha hora asignación',
    align: 'left',
    sortable: true,
  },
  {
    name: 'es_ventana',
    field: 'es_ventana',
    label: 'Es ventana',
    align: 'left',
  },
  {
    name: 'fecha_agendado',
    field: 'fecha_agendado',
    label: 'Fecha agendado',
    align: 'left',
  },
  {
    name: 'hora_inicio_agendado',
    field: 'hora_inicio_agendado',
    label: 'Hora inicio agendado',
    align: 'left',
  },
  {
    name: 'hora_fin_agendado',
    field: 'hora_fin_agendado',
    label: 'Hora fin agendado',
    align: 'left',
  },
  {
    name: 'subtarea_dependiente',
    field: 'subtarea_dependiente',
    label: 'Depende de',
    align: 'left',
  },
]
