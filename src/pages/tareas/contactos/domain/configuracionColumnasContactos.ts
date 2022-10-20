import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ClienteFinal } from './ClienteFinal'

export const configuracionColumnasContactos: ColumnConfig<ClienteFinal>[] = [
    {
        name: 'nombres',
        field: 'nombres',
        label: 'Nombres',
        align: 'left',
        sortable: true,
    },
    {
        name: 'apellidos',
        field: 'apellidos',
        label: 'Apellidos',
        align: 'left',
        sortable: true,
    },
]
