import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoFibra } from './TipoFibra'

export const configuracionColumnasTiposFibras: ColumnConfig<TipoFibra>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Fibra',
        align: 'left',
        sortable: true
    },
]