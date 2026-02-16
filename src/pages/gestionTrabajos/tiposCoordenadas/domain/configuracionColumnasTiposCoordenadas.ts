import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoCoordenada } from './TipoCoordenada'

export const configuracionColumnasTiposCoordenadas: ColumnConfig<TipoCoordenada>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
    sortable: true,
  },
]
