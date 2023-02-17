import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Cargo } from './Cargo'

export const configuracionColumnasCargos: ColumnConfig<Cargo>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Cargo',
        align: 'left',
        sortable: true
    },
]
