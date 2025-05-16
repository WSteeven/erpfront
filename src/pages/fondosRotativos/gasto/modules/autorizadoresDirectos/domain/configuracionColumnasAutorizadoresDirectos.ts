import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import {
  AutorizadorDirecto
} from 'pages/fondosRotativos/gasto/modules/autorizadoresDirectos/domain/AutorizadorDirecto'

export const configuracionColumnasAutorizadoresDirectos: ColumnConfig<AutorizadorDirecto>[]=[
  {
    name: 'empleado',
    field: 'empleado',
    label: 'Empleado',
    align: 'left',
    sortable: true,
  },
  {
    name: 'autorizador',
    field: 'autorizador',
    label: 'Autorizador Directo',
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
  {
    name: 'activo',
    field: 'activo',
    label: 'Activo',
    align: 'left',
    sortable: true,
  },
]
