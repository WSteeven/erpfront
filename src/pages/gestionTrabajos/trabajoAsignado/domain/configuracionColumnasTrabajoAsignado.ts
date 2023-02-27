import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Trabajo } from 'gestionTrabajos/trabajos/domain/Trabajo'

export const configuracionColumnasTrabajoAsignado: ColumnConfig<Trabajo>[] = [
  {
    name: 'codigo_trabajo',
    field: 'codigo_trabajo',
    label: 'Cód. Trabajo',
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
    name: 'trabajo_dependiente',
    field: 'trabajo_dependiente',
    label: 'Depende de',
    align: 'left',
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
    sortable: true,
  },
]
