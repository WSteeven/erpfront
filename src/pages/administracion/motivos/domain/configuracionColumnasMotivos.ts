import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Motivo } from './Motivo'

export const configuracionColumnasMotivos: ColumnConfig<Motivo>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
        sortable: true
    },
    {
        name: 'tipo_transaccion',
        field: 'tipo_transaccion',
        label: 'Tipo',
        align: 'left',
        sortable: true
    }
]