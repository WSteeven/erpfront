import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { DescuentosGenrales } from './DescuentosGenerales'

export const configuracionColumnasDescuentosGenrales: ColumnConfig<DescuentosGenrales>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Descuentos Generales',
        align: 'left',
        sortable: true
    },
    {
        name: 'abreviatura',
        field: 'abreviatura',
        label: 'Abreviatura',
        align: 'left',
        sortable: true
    },
]
