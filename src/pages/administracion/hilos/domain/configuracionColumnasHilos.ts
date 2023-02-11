import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Hilo } from './Hilo'

export const configuracionColumnasHilos: ColumnConfig<Hilo>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Hilo',
        align: 'left',
        sortable: true
    },
]