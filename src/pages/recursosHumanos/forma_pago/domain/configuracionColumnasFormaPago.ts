import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { FormaPago } from './FormaPago'

export const configuracionColumnasFormaPago: ColumnConfig<FormaPago>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Estado',
        align: 'left',
        sortable: true
    },
]
