import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ControlCambio } from './ControlCambio'

export const configuracionColumnasControlCambios: ColumnConfig<ControlCambio>[] =
  [
    {
      name: 'codigo_tarea_jp',
      field: 'codigo_tarea_jp',
      label: 'Código tarea JP',
      align: 'left',
      sortable: true,
    },
    {
      name: 'codigo_tarea_cliente',
      field: 'codigo_tarea_cliente',
      label: 'Código tarea Cliente',
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
      name: 'aprobado_por',
      field: 'aprobado_por',
      label: 'Aprobado por',
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
