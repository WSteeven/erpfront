import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { SolicitudExamen } from './SolicitudExamen'

export const configuracionColumnasSolicitudExamen: ColumnConfig<SolicitudExamen>[] = [
  /* {
    name: 'numero_solicitud',
    field: 'numero_solicitud',
    label: 'Número de solicitud',
    align: 'left',
    sortable: true
  },*/
  {
    name: 'created_at',
    field: 'created_at',
    label: 'Fecha de solicitud',
    align: 'left',
    sortable: true
  },
  {
    name: 'cantidad_examenes_solicitados',
    field: 'cantidad_examenes_solicitados',
    label: 'Cantidad exámenes solicitados',
    align: 'left',
    sortable: true
  },
]
