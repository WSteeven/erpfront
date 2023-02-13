import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Categoria } from './Categoria'

export const configuracionColumnasCategorias: ColumnConfig<Categoria>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Categoria',
        align: 'left',
        sortable: true
    },
]