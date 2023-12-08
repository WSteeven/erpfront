import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Areas } from './Areas'

export const configuracionColumnasAreas: ColumnConfig<Areas>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Estado',
        align: 'left',
        sortable: true
    },
]
