import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Rubro } from './Rubro'

export const configuracionColumnasRubro: ColumnConfig<Rubro>[] = [
    {
        name: 'nombre_rubro',
        field: 'nombre_rubro',
        label: 'Rubro',
        align: 'left',
        sortable: true
    },
    {
        name: 'valor_rubro',
        field: 'valor_rubro',
        label: 'Valor',
        align: 'left',
        sortable: true
    },
]
