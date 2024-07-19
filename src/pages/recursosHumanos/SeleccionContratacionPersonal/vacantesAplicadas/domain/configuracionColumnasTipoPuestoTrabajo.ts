import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoPuestoTrabajo } from './TipoPuestoTrabajo'

export const configuracionColumnasTipoPuestoTrabajo: ColumnConfig<TipoPuestoTrabajo>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
        sortable: true
    },
]
