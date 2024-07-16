import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Conocimiento } from './Conocimiento'

export const configuracionColumnasConocimientoReactive: ColumnConfig<Conocimiento>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Conocimiento',
        align: 'left',
        sortable: true
    },
]
