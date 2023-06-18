import { configuracionColumnasTicket } from 'pages/gestionTickets/tickets/domain/configuracionColumnasTicket'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Ticket } from 'pages/gestionTickets/tickets/domain/Ticket'

export const configuracionColumnasTicketAsignado: ColumnConfig<Ticket>[] = [
  ...configuracionColumnasTicket
]
