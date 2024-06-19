import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Planes } from './Planes';

export const configuracionColumnasPlanes: ColumnConfig<Planes>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
    sortable: true
  },



]
