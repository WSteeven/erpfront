import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { SolicitudMateriales } from './SolicitudMateriales'

export const configuracionColumnasSolicitudMateriales: ColumnConfig<SolicitudMateriales>[] =
  [
    {
      name: 'fecha_solicitud',
      field: 'fecha_solicitud',
      label: 'Fecha de solicitud',
      align: 'left',
      sortable: true,
    },
    {
      name: 'grupo',
      field: 'grupo',
      label: 'Grupo solicitante',
      align: 'left',
      sortable: true,
    },
    {
      name: 'estado',
      field: 'estado',
      label: 'Estado de la solicitud',
      align: 'left',
      sortable: true,
    },
  ]
