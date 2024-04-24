import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { SolicitudExamen } from './SolicitudExamen'

export const configuracionColumnasSolicitudExamen: ColumnConfig<SolicitudExamen>[] = [
  {
    name: 'codigo',
    field: 'codigo',
    label: 'Código',
    align: 'left',
    sortable: true
  },
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
  {
    name: 'empleado',
    field: 'empleado',
    label: 'Empleado',
    align: 'left',
    sortable: true
  },
  {
    name: 'departamento',
    field: 'departamento',
    label: 'Departamento',
    align: 'left',
    sortable: true
  },
]
