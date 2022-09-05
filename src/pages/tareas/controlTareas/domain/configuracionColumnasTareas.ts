import { ColumnConfig } from 'src/components/tables/domain/ColumnConfig'
import { Tarea } from '../domain/Tarea'

export const configuracionColumnasTareas: ColumnConfig<Tarea>[] = [
  {
    name: 'codigo_tarea_jp',
    field: 'codigo_tarea_jp',
    label: 'Código tarea JP',
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
    name: 'cliente',
    field: 'cliente',
    label: 'Cliente',
    align: 'center',
    sortable: true,
  },
  {
    name: 'solicitante',
    field: 'solicitante',
    label: 'Solicitante',
    align: 'center',
    sortable: true,
    visible: false,
  },
  /* {
    name: 'fecha_finalizacion',
    field: 'fecha_finalizacion',
    label: 'Fecha de finalización',
    align: 'center',
    sortable: true,
    visible: false,
  },
  {
    name: 'fecha_agendado',
    field: 'fecha_agendado',
    label: 'Fecha agendado',
    align: 'center',
    sortable: true,
    visible: false,
  },
  {
    name: 'hora_agendado',
    field: 'hora_agendado',
    label: 'Hora agendado',
    align: 'center',
    sortable: true,
    visible: false,
  }, */
  {
    name: 'coordinador',
    field: 'coordinador',
    label: 'Coordinador',
    align: 'center',
    sortable: true,
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'center',
    sortable: true,
  },
]
