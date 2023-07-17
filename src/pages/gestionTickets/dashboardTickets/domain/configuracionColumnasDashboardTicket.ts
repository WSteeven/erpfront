import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasDashboardTicket: ColumnConfig<any>[] = [
  {
    name: 'codigo',
    field: 'codigo',
    label: 'Código de ticket',
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
    name: 'tiempo_hasta_finalizar',
    field: 'tiempo_hasta_finalizar',
    label: 'Tiempo que tomó finalizarlo',
    align: 'right',
    sortable: true,
  },
  {
    name: 'tiempo_ocupado_pausas',
    field: 'tiempo_ocupado_pausas',
    label: 'Tiempo ocupado en pausas',
    align: 'right',
    sortable: true,
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
    sortable: true,
  },
]
