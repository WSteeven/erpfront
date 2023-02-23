import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ControlAsistencia } from './ControlAsistencia'

export const configuracionColumnasControlAsistencia: ColumnConfig<ControlAsistencia>[] =
  [
    {
      name: 'codigo_tarea_jp',
      field: 'codigo_tarea_jp',
      label: 'Código tarea JP',
      align: 'left',
      sortable: true,
    },
    {
      name: 'detalle_tarea',
      field: 'detalle_tarea',
      label: 'Detalle tarea',
      align: 'left',
      sortable: true,
    },
    {
      name: 'codigo_subtarea',
      field: 'codigo_subtarea',
      label: 'Código subtarea',
      align: 'left',
      sortable: true,
    },
    {
      name: 'detalle_subtarea',
      field: 'detalle_subtarea',
      label: 'Detalle subtarea',
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
      name: 'fecha',
      field: 'fecha',
      label: 'Fecha',
      align: 'left',
      sortable: true,
    },
  ]
