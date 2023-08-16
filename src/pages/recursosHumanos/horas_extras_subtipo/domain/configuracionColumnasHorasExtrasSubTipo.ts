import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { HorasExtrasSubTipo } from './HorasExtrasSubTipo'

export const configuracionColumnasHorasExtrasSubTipo: ColumnConfig<HorasExtrasSubTipo>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Descuentos Generales',
        align: 'left',
        sortable: true
    },
]
