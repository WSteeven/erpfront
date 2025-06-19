import { CategoriaTipoTicket } from 'pages/gestionTickets/categoriasTiposTickets/domain/CategoriaTipoTicket'
import { TipoTicket } from 'pages/gestionTickets/tiposTickets/domain/TipoTicket'

export class DestinatarioTicket {
  departamento_id: number | null
  categoria_id: number | null
  tipo_ticket_id: number | null
  departamento?: string | null
  categorias?: CategoriaTipoTicket[]
  categorias_filter: any[] = []
  tipos_tickets?: TipoTicket[]
  tipos_tickets_filter?: TipoTicket[] = []
  destinatario_automatico: number | null = null

  constructor() {
    this.departamento_id = null
    this.categoria_id = null
    this.tipo_ticket_id = null
    this.departamento = null
    this.categorias = []
    this.tipos_tickets = []
  }
}
