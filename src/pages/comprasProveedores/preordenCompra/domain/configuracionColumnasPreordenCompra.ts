import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { PreordenCompra } from './PreordenCompra';

export const configuracionColumnasPreordenesCompras: ColumnConfig<PreordenCompra>[] = [
  {
    name: 'id',
    field: 'id',
    label: 'N°',
    align: 'left',
    sortable: true,
  },
  {
    name: 'created_at',
    field: 'created_at',
    label: 'Fecha de creación',
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
    name: 'pedido',
    field: 'pedido',
    label: 'Pedido',
    align: 'left',
    sortable: true,
  },
  {
    name: 'autorizacion',
    field: 'autorizacion',
    label: 'Autorización',
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
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
    sortable: true,
  },
] 