import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { SolicitudMaterial } from './SolicitudMaterial'

export const configuracionColumnasSolicitudMateriales: ColumnConfig<SolicitudMaterial>[] =
  [
    {
      name: 'fecha_solicitud',
      field: 'fecha_solicitud',
      label: 'Fecha de solicitud',
      align: 'left',
      sortable: true,
    },
    {
      name: 'codigo_tarea_jp',
      field: 'codigo_tarea_jp',
      label: 'Código tarea JP',
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
