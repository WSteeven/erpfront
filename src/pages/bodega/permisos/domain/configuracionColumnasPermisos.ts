import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Permiso } from './Permiso'

export const configuracionColumnasCategorias: ColumnConfig<Permiso>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Permiso',
        align: 'left',
        sortable: true
    },
]
