import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { AcreditacionSemana } from './AcreditacionSemana';

export const ConfiguracionColumnasAcreditacionSemana: ColumnConfig<AcreditacionSemana>[] = [
  {
    name: 'semana',
    field: 'semana',
    label: 'Semana',
    align: 'left',
    sortable: true
  },
]
