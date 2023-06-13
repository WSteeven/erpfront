import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { HorasExtrasTipo } from './HorasExtrasTipo'

export const configuracionColumnasHorasExtrasTipo: ColumnConfig<HorasExtrasTipo>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Descuentos Generales',
        align: 'left',
        sortable: true
    },
]
