import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Organigrama } from './Organigrama';

export const configuracionColumnasOrganigrama: ColumnConfig<Organigrama>[] = [
  {
    name: 'empleado_id',
    field: 'empleado_id',
    label: 'Empleado',
    align: 'left',
    sortable: true,

  },
  {
    name: 'cargo',
    field: 'cargo',
    label: 'Cargo',
    align: 'left',
    sortable: true,

  },
  {
    name: 'tipo',
    field: 'tipo',
    label: 'Tipo',
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
  {
    name: 'nivel',
    field: 'nivel',
    label: 'Nivel',
    align: 'left',
    sortable: true
  },
  {
    name: 'jefe_id',
    field: 'jefe_id',
    label: 'Jefe Inmediato',
    align: 'left',
    sortable: true,

  }
];
