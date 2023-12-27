import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TransferenciaProductoEmpleado } from './TransferenciaProductoEmpleado'

export const configuracionColumnasDevoluciones: ColumnConfig<TransferenciaProductoEmpleado>[] = [
  {
    name: 'id',
    field: 'id',
    label: 'N°',
    align: 'left',
    sortable: true
  },
  {
    name: 'justificacion',
    field: 'justificacion',
    label: 'Justificación',
    style: 'max-width: 300px; overflow: auto;',
    align: 'left',
    sortable: true
  },
  {
    name: 'solicitante',
    field: 'solicitante',
    label: 'Solicitante',
    align: 'left',
    sortable: true
  },
  {
    name: 'autorizacion',
    field: 'autorizacion',
    label: 'Autorización',
    align: 'left',
    sortable: true
  },
  {
    name: 'autorizador',
    field: 'autorizador',
    label: 'Autoriza',
    align: 'left',
    sortable: true
  },
  {
    name: 'tarea_origen',
    field: 'tarea_origen',
    label: 'Tarea origen',
    style: 'max-width: 300px; overflow: auto;',
    align: 'left',
    sortable: true
  },
  {
    name: 'tarea_destino',
    field: 'tarea_destino',
    label: 'Tarea destino',
    style: 'max-width: 300px; overflow: auto;',
    align: 'left',
    sortable: true
  },
]
