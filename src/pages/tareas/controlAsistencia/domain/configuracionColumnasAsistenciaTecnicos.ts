import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { AsistenciaTecnico } from './AsistenciaTecnico'

export const configuracionColumnasAsistenciaTecnicos: ColumnConfig<AsistenciaTecnico>[] =
  [
    {
      name: 'nombres',
      field: 'nombres',
      label: 'Nombres',
      align: 'left',
      sortable: true,
    },
    {
      name: 'apellidos',
      field: 'apellidos',
      label: 'Apellidos',
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
      name: 'observacion',
      field: 'observacion',
      label: 'Observación',
      align: 'left',
      sortable: true,
    },
  ]
