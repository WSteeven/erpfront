import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Subtarea } from '../../subtareas/domain/Subtarea'

export const configuracionColumnasSubtareas: ColumnConfig<Subtarea>[] = [
  {
    name: 'codigo_subtarea',
    field: 'codigo_subtarea',
    label: 'Cód. Subtarea',
    align: 'left',
    sortable: true,
  },
  {
    name: 'detalle',
    field: 'detalle',
    label: 'Detalle / Ruta / Enlace / Proyecto',
    align: 'left',
  },
  {
    name: 'tipo_trabajo',
    field: 'tipo_trabajo',
    label: 'Tipo de trabajo',
    align: 'left',
  },
  {
    name: 'fecha_hora_creacion',
    field: 'fecha_hora_creacion',
    label: 'Fecha hora creación',
    align: 'left',
  },
  {
    name: 'fecha_hora_asignacion',
    field: 'fecha_hora_asignacion',
    label: 'Fecha hora asignación',
    align: 'left',
  },
  {
    name: 'fecha_hora_ejecucion',
    field: 'fecha_hora_ejecucion',
    label: 'Fecha hora ejecución',
    align: 'left',
  },
  {
    name: 'fecha_hora_realizado',
    field: 'fecha_hora_realizado',
    label: 'Fecha hora realizado',
    align: 'left',
  },
  {
    name: 'fecha_hora_finalizacion',
    field: 'fecha_hora_finalizacion',
    label: 'Fecha hora finalización',
    align: 'left',
  },
  {
    name: 'dias_ocupados',
    field: 'dias_ocupados',
    label: 'Días ocupados',
    align: 'left',
  },
  {
    name: 'fecha_hora_suspendido',
    field: 'fecha_hora_suspendido',
    label: 'Fecha hora suspención',
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
    label: 'Fecha hora cancelación',
    align: 'left',
  },
  {
    name: 'causa_cancelacion',
    field: 'causa_cancelacion',
    label: 'Causa de cancelación',
    align: 'left',
  },
  {
    name: 'empleados',
    field: 'empleados',
    label: 'Empleados',
    align: 'left',
  },
  {
    name: 'grupos',
    field: 'grupos',
    label: 'Grupos',
    align: 'left',
  },
  {
    name: 'es_ventana',
    field: 'es_ventana',
    label: 'Es ventana',
    align: 'left',
  },
  {
    name: 'fecha_ventana',
    field: 'fecha_ventana',
    label: 'Fecha de ventana',
    align: 'left',
  },
  {
    name: 'hora_inicio_ventana',
    field: 'hora_inicio_ventana',
    label: 'Hora inicio de ventana',
    align: 'left',
  },
  {
    name: 'hora_fin_ventana',
    field: 'hora_fin_ventana',
    label: 'Hora fin de ventana',
    align: 'left',
  },
  {
    name: 'subtarea_dependiente',
    field: 'subtarea_dependiente',
    label: 'Depende de',
    align: 'left',
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
  },
]
