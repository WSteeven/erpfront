import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Tramo } from './Tramo'

export const configuracionColumnasTramos: ColumnConfig<Tramo>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre del tramo',
        align: 'left',
    },
]
