import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Proforma } from './Proforma';

export const configuracionColumnasProformas: ColumnConfig<Proforma>[] = [
  {
    name: 'id',
    field: 'id',
    label: 'N°',
    align: 'left',
    sortable: true,
  },
  {
    name: 'codigo',
    field: 'codigo',
    label: 'Código',
    align: 'left',
    sortable: true,
  },
  {
    name: 'created_at',
    field: 'created_at',
    label: 'Fecha',
    align: 'left',
    sortable: true,
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    style: 'max-width: 300px; overflow: auto;',
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
    name: 'cliente',
    field: 'cliente',
    label: 'Cliente',
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
    label: 'Autorización',
    align: 'left',
    sortable: true,
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado Prefacturado',
    align: 'left',
    sortable: true,
  },
]
