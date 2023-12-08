import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Banco } from './Banco'

export const configuracionColumnasBanco: ColumnConfig<Banco>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
        sortable: true
    },
    {
        name: 'codigo',
        field: 'codigo',
        label: 'Código',
        align: 'left',
        sortable: true
    },
]
