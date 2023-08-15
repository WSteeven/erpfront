import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Banco } from './Banco'

export const configuracionColumnasBanco: ColumnConfig<Banco>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Estado',
        align: 'left',
        sortable: true
    },
]
