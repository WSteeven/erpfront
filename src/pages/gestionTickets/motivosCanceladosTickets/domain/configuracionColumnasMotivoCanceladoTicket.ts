import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { MotivoCanceladoTicket } from './MotivoCanceladoTicket'

export const configuracionColumnasMotivoTicket: ColumnConfig<MotivoCanceladoTicket>[] = [
  {
    name: 'motivo',
    field: 'motivo',
    label: 'Motivo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Activo',
    align: 'left',
  },
]
