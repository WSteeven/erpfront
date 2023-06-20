import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { DescuentosLey } from './DescuentosLey'

export const configuracionColumnasDescuentosLey: ColumnConfig<DescuentosLey>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Descuentos de Ley',
        align: 'left',
        sortable: true
    },
]
