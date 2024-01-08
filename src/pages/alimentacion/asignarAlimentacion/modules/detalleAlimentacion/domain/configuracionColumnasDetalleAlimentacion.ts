import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Alimentacion } from './DetalleAlimentacion'

export const configuracionColumnasDetalleAlimentacion: ColumnConfig<Alimentacion>[] =
  [
    {
      name: 'empleado_info',
      field: 'empleado_info',
      label: 'Empleado',
      align: 'left',
      sortable: true,
    },
    {
      name: 'valor_asignado',
      field: 'valor_asignado',
      label: 'Valor asignado',
      align: 'left',
      sortable: true,
    },
    {
      name: 'fecha_corte',
      field: 'fecha_corte',
      label: 'Fecha de corte',
      align: 'left',
      sortable: true,
    },
  ]
