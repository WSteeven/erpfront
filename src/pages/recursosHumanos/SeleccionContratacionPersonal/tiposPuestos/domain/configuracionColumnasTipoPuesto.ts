import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoPuesto } from './TipoPuesto'

export const configuracionColumnasTipoPuestoTrabajo: ColumnConfig<TipoPuesto>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
        sortable: true
    },
]
