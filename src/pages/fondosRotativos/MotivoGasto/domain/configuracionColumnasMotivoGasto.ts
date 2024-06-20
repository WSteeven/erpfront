import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { MotivoGasto } from './MotivoGasto';

export const configuracionColumnasMotivoGasto: ColumnConfig<MotivoGasto>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
    sortable: true
  },
]
