import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Contacto } from './Contacto'

export const configuracionColumnasContactos: ColumnConfig<Contacto>[] = [
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
