import { ColumnConfig } from 'components/tables/domain/ColumnConfig'


export const configuracionColumnasSeguimientoDetalle: ColumnConfig<any>[] =
  [
    {
      name: 'fecha',
      field: 'fecha',
      label: 'Fecha',
      align: 'left',
      sortable: true,
    },
    {
      name: 'detalle',
      field: 'detalle',
      label: 'Detalle del producto',
      align: 'left',
      sortable: true,
    },
    {
      name: 'num_transaccion',
      field: 'num_transaccion',
      label: 'N° transacción',
      align: 'left',
      sortable: true,
    },
    {
      name: 'motivo',
      field: 'motivo',
      label: 'Motivo',
      align: 'left',
      sortable: true,
    },
    {
      name: 'tipo',
      field: 'tipo',
      label: 'Tipo',
      align: 'left',
      sortable: true,
    },
    {
      name: 'cant_anterior',
      field: 'cant_anterior',
      label: 'Stock anterior',
      align: 'left',
      sortable: true,
    },
    {
      name: 'cantidad',
      field: 'cantidad',
      label: 'Cantidad',
      align: 'left',
      sortable: true,
    },
    {
      name: 'cant_actual',
      field: 'cant_actual',
      label: 'Stock actual',
      align: 'left',
      sortable: true,
    },
  ]
