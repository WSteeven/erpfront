import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Percha } from './Percha'

export const configuracionColumnasPerchas: ColumnConfig<Percha>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
        sortable: true
    },
    {
        name: 'sucursal',
        field: 'sucursal',
        label: 'Sucursal',
        align: 'left',
        sortable: true
    },
]