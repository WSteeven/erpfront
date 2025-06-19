import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { ProveedorInternacional } from './ProveedorInternacional';

export const configuracionColumnasProveedoresInternacionales: ColumnConfig<ProveedorInternacional>[]=[
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Razón Social',
    align: 'left',
    sortable: true,
  },
  {
    name: 'pais',
    field: 'pais',
    label: 'País',
    align: 'left',
    sortable: true,
  },
  {
    name: 'direccion',
    field: 'direccion',
    label: 'Direccion',
    align: 'left',
    sortable: true,
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Activo',
    align: 'left',
    sortable: true,
  },
]
