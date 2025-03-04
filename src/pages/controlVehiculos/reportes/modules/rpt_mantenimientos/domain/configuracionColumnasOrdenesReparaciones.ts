import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { OrdenReparacion } from 'vehiculos/ordenesReparacion/domain/OrdenReparacion'

export const configuracionColumnasOrdenesReparacionesReporte: ColumnConfig<OrdenReparacion>[] = [
  {
    name: 'fecha',
    field: 'fecha',
    label: 'Fecha',
    align: 'left',
    sortable: true,
  },
  {
    name: 'vehiculo',
    field: 'vehiculo',
    label: 'Placa',
    align: 'left',
    sortable: true,
  },
  {
    name: 'solicitante',
    field: 'solicitante',
    label: 'Solicitante',
    align: 'left',
    sortable: true,
  },
  {
    name: 'autorizador',
    field: 'autorizador',
    label: 'Autorizador',
    align: 'left',
    sortable: true,
  },
  {
    name: 'autorizacion',
    field: 'autorizacion',
    label: 'Estado',
    align: 'left',
    sortable: true,
  },
  {
    name: 'valor_reparacion',
    field: 'valor_reparacion',
    label: 'Valor Reparación',
    align: 'left',
    sortable: true,
  },
  {
    name: 'servicios',
    field: 'servicios',
    label: 'Servicios',
    align: 'left',
    sortable: true,
  },
  {
    name: 'observacion',
    field: 'observacion',
    label: 'Observación',
    align: 'left',
    sortable: true,
  },
]
