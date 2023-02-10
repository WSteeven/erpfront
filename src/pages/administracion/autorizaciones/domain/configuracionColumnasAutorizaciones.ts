import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Autorizacion } from './Autorizacion'

export const configuracionColumnasAutorizaciones: ColumnConfig<Autorizacion>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Autorizacion',
        align: 'left',
        sortable: true
    }
]