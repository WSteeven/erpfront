import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
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
  {
    name: 'titulo',
    field: 'titulo',
    label: 'Título de la tarea',
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
