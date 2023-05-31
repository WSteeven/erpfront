import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Ticket } from './Ticket'

export const configuracionColumnasTicket: ColumnConfig<Ticket>[] = [
  {
    name: 'codigo',
    field: 'codigo',
    label: 'Código del ticket',
    align: 'left',
    sortable: true,
  },
  {
    name: 'tipo_ticket',
    field: 'tipo_ticket',
    label: 'Tipo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'asunto',
    field: 'asunto',
    label: 'Asunto',
    align: 'left',
    sortable: true,
  },
  {
    name: 'solicitante',
    field: 'solicitante',
    label: 'Solicitante',
    align: 'left',
  },
  {
    name: 'responsable',
    field: 'responsable',
    label: 'Responsable',
    align: 'left',
    sortable: true,
  },
  {
    name: 'fecha_hora_limite',
    field: 'fecha_hora_limite',
    label: 'Fecha y hora límite',
    align: 'left',
    sortable: true,
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
  },
]
