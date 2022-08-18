import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ControlDiarioMaterial } from './ControlDiarioMaterial'

export const configuracionColumnasTiposTareas: ColumnConfig<ControlDiarioMaterial>[] =
  [
    {
      name: 'codigo_tarea_jp',
      field: 'codigo_tarea_jp',
      label: 'Código tarea JP',
      align: 'left',
      sortable: true,
    },
    {
      name: 'codigo_subtarea_jp',
      field: 'codigo_subtarea_jp',
      label: 'Código subtarea JP',
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
