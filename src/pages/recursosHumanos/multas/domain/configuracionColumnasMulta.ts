import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Multa } from './Multa'

export const configuracionColumnasMulta: ColumnConfig<Multa>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Multa',
        align: 'left',
        sortable: true
    },
]
