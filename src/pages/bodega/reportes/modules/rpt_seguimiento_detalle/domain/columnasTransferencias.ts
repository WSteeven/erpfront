import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const columnasTransferencias: ColumnConfig<any>[] = [
  {
    name: 'id',
    field: 'id',
    label: 'Id',
    align: 'left',
    sortable: true,
    visible: false
  },
  {
    name: 'created_at',
    field: 'created_at',
    label: 'Fecha',
    align: 'left'
  },
  {
    name: 'transferencia_id',
    field: 'transferencia_id',
    label: 'N° Transferencia',
    align: 'left'
  },
  {
    name: 'empleado_envia',
    field: 'empleado_envia',
    label: 'Envia',
    align: 'left'
  },
  {
    name: 'empleado_recibe',
    field: 'empleado_recibe',
    label: 'Recibe',
    align: 'left'
  },
  {
    name: 'cantidad',
    field: 'cantidad',
    label: 'Cantidad',
    type: 'number',
    align: 'left',
    editable: true,
    sortable: true
  },
  {
    name: 'producto',
    field: 'producto',
    label: 'Producto',
    align: 'left',
    sortable: true
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    align: 'left',
    type: 'textarea',
    editable: false,
    sortable: true
  },
  {
    name: 'unidad_medida',
    field: 'unidad_medida',
    label: 'Medida',
    align: 'left'
  },
  {
    name: 'serial',
    field: 'serial',
    label: 'Serial',
    align: 'left',
    type: 'text',
    editable: true,
    sortable: true
  }
]
