import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Umbral } from './Umbral';

export const configuracionColumnasUmbral: ColumnConfig<Umbral>[] = [
  {
    name: 'empleado_info',
    field: 'empleado_info',
    label: 'Empleado',
    align: 'left',
    sortable: true
  },
  {
    name: 'valor_minimo',
    field: 'valor_minimo',
    label: 'Valor Minimo',
    align: 'left',
    sortable: true
  },
  {
    name: 'referencia',
    field: 'referencia',
    label: 'Referencia',
    align: 'left',
    sortable: true
  },



]
