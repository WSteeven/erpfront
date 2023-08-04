import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { EstadoCivil } from './EstadoCivil'

export const configuracionColumnasEstadoCivil: ColumnConfig<EstadoCivil>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Estado',
        align: 'left',
        sortable: true
    },
]
