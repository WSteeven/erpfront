import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Periodo } from './Periodo'

export const configuracionColumnasPeriodo: ColumnConfig<Periodo>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Estado',
        align: 'left',
        sortable: true
    },
]
