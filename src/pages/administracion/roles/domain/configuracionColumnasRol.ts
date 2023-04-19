import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Rol } from './Rol'

export const configuracionColumnasRol: ColumnConfig<Rol>[] = [
    {
        name: 'name',
        field: 'name',
        label: 'Nombre',
        align: 'left',
        sortable: true
    },
]
