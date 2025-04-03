import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Accidente } from './Accidente'

export const configuracionColumnasAccidente: ColumnConfig<Accidente>[] = [
    {
        name: 'titulo',
        field: 'titulo',
        label: 'Título',
        align: 'left',
        sortable: true,
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción',
        align: 'left',
        sortable: true,
    },
    {
        name: 'created_at',
        field: 'created_at',
        label: 'Fecha de accidente',
        align: 'left',
        sortable: true,
    },
]

