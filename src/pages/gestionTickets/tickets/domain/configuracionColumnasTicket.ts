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
  {
    name: 'tiempo_hasta_finalizar',
    field: 'tiempo_hasta_finalizar',
    label: 'Tiempo hasta finalizar',
    align: 'left',
  },
  {
    name: 'tiempo_ocupado_pausas',
    field: 'tiempo_ocupado_pausas',
    label: 'Tiempo ocupado pausas',
    align: 'left',
  },
  /* {
    name: 'calificado_solicitante',
    field: 'calificado_solicitante',
    label: 'Calificado solicitante',
    align: 'left',
    sortable: true,
  },
  {
    name: 'calificado_responsable',
    field: 'calificado_responsable',
    label: 'Calificado responsable',
    align: 'left',
    sortable: true,
  }, */
]
