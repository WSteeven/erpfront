import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Condicion } from './Condicion'

export const configuracionColumnasCondiciones: ColumnConfig<Condicion>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Condiciones de productos',
        align: 'left',
        sortable: true
    }
]