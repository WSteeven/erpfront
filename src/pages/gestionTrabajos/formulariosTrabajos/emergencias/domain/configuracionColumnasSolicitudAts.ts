import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Ticket } from 'pages/gestionTickets/tickets/domain/Ticket'

export const configuracionColumnasSolicitudAts: ColumnConfig<Ticket>[] = [
  {
    name: 'codigo',
    field: 'codigo',
    label: 'Código del ticket',
    align: 'left',
    sortable: true,
    visible: false,
    editable: false,
  },
  {
    name: 'asunto',
    field: 'asunto',
    label: 'Asunto',
    align: 'left',
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    align: 'left',
  },
  {
    name: 'responsable',
    field: 'responsable',
    label: 'Responsable',
    align: 'left',
    sortable: true,
    editable: false,
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
    editable: false,
  },
]
